import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Eye,
  Image as ImageIcon,
  Shield,
  FileText,
  Upload,
} from "lucide-react";
import { logAudit } from "@/utils/audit";

interface SitePage {
  id: string;
  page_key: string;
  page_name: string;
  hero_title: string | null;
  hero_description: string | null;
  hero_eyebrow: string | null;
  hero_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  content: any;
}

export function SitePageEditor({ pageKey }: { pageKey: string }) {
  const [page, setPage] = useState<SitePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadPage = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_pages")
      .select("*")
      .eq("page_key", pageKey)
      .maybeSingle();

    if (error) {
      toast.error("Failed to load page content");
    } else if (data) {
      setPage(data as SitePage);
    }
    setLoading(false);
  }, [pageKey]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handleUpload = async (file: File) => {
    if (!file) return;
    const path = `heroes/${pageKey}-${Date.now()}.${file.name.split(".").pop()}`;
    setUploading(true);
    const { error: upErr } = await supabase.storage
      .from("site-media")
      .upload(path, file, { upsert: false, contentType: file.type });
    if (upErr) {
      setUploading(false);
      toast.error("Upload failed: " + upErr.message);
      return;
    }
    const { data: pub } = supabase.storage
      .from("site-media")
      .getPublicUrl(path);
    if (page) {
      setPage({ ...page, hero_image_url: pub.publicUrl });
    }
    setUploading(false);
    toast.success("Hero image uploaded. Save to apply.");
  };

  async function handleSave() {
    if (!page) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_pages")
      .update({
        hero_title: page.hero_title,
        hero_description: page.hero_description,
        hero_eyebrow: page.hero_eyebrow,
        hero_image_url: page.hero_image_url,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        content: page.content,
      })
      .eq("page_key", pageKey);

    if (error) {
      toast.error("Failed to save changes: " + error.message);
    } else {
      toast.success("Page content updated successfully");
      logAudit({
        action_type: "UPDATE",
        resource_type: "page",
        resource_name: page.page_name,
      });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground">
          No data found for page: {pageKey}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            // Create a default entry if it doesn't exist
            setPage({
              id: "",
              page_key: pageKey,
              page_name: pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
              hero_title: "",
              hero_description: "",
              hero_eyebrow: "",
              hero_image_url: "",
              seo_title: "",
              seo_description: "",
              content: {},
            });
          }}
        >
          Initialize Page Data
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Edit {page.page_name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage text, images and SEO for this page.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Hero Section Editor */}
        <section className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
            <Eye className="text-accent" size={20} />
            <h3 className="font-serif text-lg font-bold">Hero Section</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eyebrow">Eyebrow (Small text above title)</Label>
              <Input
                id="eyebrow"
                value={page.hero_eyebrow || ""}
                onChange={(e) =>
                  setPage({ ...page, hero_eyebrow: e.target.value })
                }
                placeholder="e.g. ISO-Accredited Excellence"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Main Title</Label>
              <Input
                id="title"
                value={page.hero_title || ""}
                onChange={(e) =>
                  setPage({ ...page, hero_title: e.target.value })
                }
                placeholder="e.g. Advancing Organisations with Global Standards"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={page.hero_description || ""}
                onChange={(e) =>
                  setPage({ ...page, hero_description: e.target.value })
                }
                placeholder="The paragraph text in the hero section..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero_image">Hero Image</Label>
              <div className="flex gap-2">
                <Input
                  id="hero_image"
                  value={page.hero_image_url || ""}
                  onChange={(e) =>
                    setPage({ ...page, hero_image_url: e.target.value })
                  }
                  placeholder="Paste URL or upload..."
                  className="flex-1"
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Upload size={18} />
                  )}
                </Button>
              </div>
              {page.hero_image_url && (
                <div className="group relative mt-2 aspect-video overflow-hidden rounded-xl border border-border bg-muted">
                  <img
                    src={page.hero_image_url}
                    alt="Hero preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setPage({ ...page, hero_image_url: "" })}
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SEO Editor */}
        <section className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
            <Shield className="text-accent" size={20} />
            <h3 className="font-serif text-lg font-bold">
              Search Engine Optimization
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo_title">Browser Tab Title (SEO Title)</Label>
              <Input
                id="seo_title"
                value={page.seo_title || ""}
                onChange={(e) =>
                  setPage({ ...page, seo_title: e.target.value })
                }
                placeholder="JPCann Associates Limited | Home"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_desc">Meta Description</Label>
              <Textarea
                id="seo_desc"
                rows={3}
                value={page.seo_description || ""}
                onChange={(e) =>
                  setPage({ ...page, seo_description: e.target.value })
                }
                placeholder="A short summary of the page for Google search results..."
              />
            </div>
          </div>
        </section>
      </div>

      {/* Dynamic Content (JSON Editor) */}
      <section className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
          <FileText className="text-accent" size={20} />
          <h3 className="font-serif text-lg font-bold">Extended Content</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Advanced section data (Services, Why Us, etc.) stored in JSON format.
        </p>
        <Textarea
          rows={15}
          className="font-mono text-sm"
          value={JSON.stringify(page.content, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setPage({ ...page, content: parsed });
            } catch (err) {
              // Just let them type, but don't parse if invalid
            }
          }}
        />
      </section>
    </div>
  );
}
