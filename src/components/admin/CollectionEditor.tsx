import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Upload,
  GripVertical,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { logAudit } from "@/utils/audit";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type CollectionItem = {
  id: string;
  item_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
};

interface CollectionEditorProps {
  collectionKey: string;
  labelSingular: string;
  labelPlural: string;
  showImage?: boolean;
  showSubtitle?: boolean;
  showDescription?: boolean;
  subtitleLabel?: string;
  titleLabel?: string;
}

export function CollectionEditor({
  collectionKey,
  labelSingular,
  labelPlural,
  showImage = true,
  showSubtitle = true,
  showDescription = false,
  subtitleLabel = "Subtitle",
  titleLabel = "Title",
}: CollectionEditorProps) {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CollectionItem | "new" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<CollectionItem | null>(
    null,
  );

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_collections")
      .select("*")
      .eq("collection_key", collectionKey)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) toast.error(`Could not load ${labelPlural.toLowerCase()}`);
    else setItems(data as CollectionItem[]);
    setLoading(false);
  }, [collectionKey, labelPlural]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle ?? "").toLowerCase().includes(q),
    );
  }, [items, query]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase
      .from("site_collections")
      .delete()
      .eq("id", confirmDelete.id);

    if (error) toast.error(`Could not delete ${labelSingular}`);
    else {
      toast.success(`${labelSingular} deleted`);
      logAudit({
        action_type: "DELETE",
        resource_type: collectionKey,
        resource_name: confirmDelete.title,
      });
      setConfirmDelete(null);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative md:max-w-sm md:flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${labelPlural.toLowerCase()}…`}
            className="pl-9 h-11 rounded-xl"
          />
        </div>
        <Button
          onClick={() => setEditing("new")}
          className="h-11 rounded-xl px-6"
        >
          <Plus size={18} className="mr-2" /> Add {labelSingular}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-sm text-muted-foreground">
            <Loader2 className="mb-4 animate-spin text-primary" size={32} />
            Loading {labelPlural.toLowerCase()}…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
              <Search size={24} />
            </div>
            <p className="text-muted-foreground">
              No {labelPlural.toLowerCase()} found.
            </p>
            <Button
              variant="link"
              onClick={() => setEditing("new")}
              className="mt-2 text-primary font-bold"
            >
              Add your first {labelSingular}
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-12"></TableHead>
                {showImage && <TableHead>Image</TableHead>}
                <TableHead>{titleLabel}</TableHead>
                {showSubtitle && <TableHead>{subtitleLabel}</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-slate-50/30 transition-colors"
                >
                  <TableCell>
                    <GripVertical
                      size={16}
                      className="text-muted-foreground/40 cursor-grab"
                    />
                  </TableCell>
                  {showImage && (
                    <TableCell>
                      {item.image_url ? (
                        <div className="h-12 w-12 overflow-hidden rounded-lg border border-border bg-slate-50">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="h-full w-full object-contain p-1"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Upload size={16} />
                        </div>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="font-semibold text-foreground">
                    {item.title}
                  </TableCell>
                  {showSubtitle && (
                    <TableCell className="text-sm text-muted-foreground">
                      {item.subtitle || "—"}
                    </TableCell>
                  )}
                  <TableCell>
                    {item.is_published ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1 px-2">
                        <CheckCircle2 size={12} /> Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1 px-2">
                        <XCircle size={12} /> Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                        onClick={() => setEditing(item)}
                      >
                        <Pencil size={14} />
                      </Button>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setConfirmDelete(item)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {editing && (
        <ItemEditor
          collectionKey={collectionKey}
          labelSingular={labelSingular}
          item={editing === "new" ? null : editing}
          showImage={showImage}
          showSubtitle={showSubtitle}
          showDescription={showDescription}
          subtitleLabel={subtitleLabel}
          titleLabel={titleLabel}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-2xl">
              Delete this {labelSingular}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently remove "{confirmDelete?.title}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl border-slate-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ItemEditor({
  collectionKey,
  labelSingular,
  item,
  showImage,
  showSubtitle,
  showDescription,
  subtitleLabel,
  titleLabel,
  onClose,
  onSaved,
}: {
  collectionKey: string;
  labelSingular: string;
  item: CollectionItem | null;
  showImage: boolean;
  showSubtitle: boolean;
  showDescription: boolean;
  subtitleLabel: string;
  titleLabel: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = item === null;
  const [title, setTitle] = useState(item?.title ?? "");
  const [subtitle, setSubtitle] = useState(item?.subtitle ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [sortOrder, setSortOrder] = useState<number>(item?.sort_order ?? 0);
  const [published, setPublished] = useState(item?.is_published ?? true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    const slugBase = slugify(title) || `item-${Date.now()}`;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${collectionKey}/${slugBase}-${Date.now()}.${ext}`;

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
    setImageUrl(pub.publicUrl);
    setUploading(false);
    toast.success("Image uploaded successfully");
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error(`${titleLabel} is required`);
      return;
    }

    setSaving(true);
    const payload = {
      collection_key: collectionKey,
      item_key: slugify(title) || `item-${Date.now()}`,
      title,
      subtitle: showSubtitle ? subtitle || null : null,
      description: showDescription ? description || null : null,
      image_url: showImage ? imageUrl || null : null,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      is_published: published,
      metadata: {},
    };

    const res = isNew
      ? await supabase.from("site_collections").insert([payload])
      : await supabase
          .from("site_collections")
          .update(payload)
          .eq("id", item!.id);

    setSaving(false);
    if (res.error) {
      toast.error(`Could not save ${labelSingular}: ` + res.error.message);
      return;
    }

    toast.success(`${labelSingular} saved`);
    logAudit({
      action_type: isNew ? "CREATE" : "UPDATE",
      resource_type: collectionKey,
      resource_name: title,
    });
    onSaved();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl border-none shadow-2xl p-0">
        <div className="bg-slate-50 px-8 py-6 border-b border-border rounded-t-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl font-bold tracking-tight text-foreground">
              {isNew ? `Add New ${labelSingular}` : `Edit ${labelSingular}`}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base">
              Update the details below to manage this item.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 px-8 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="item-title"
                className="text-sm font-bold text-foreground"
              >
                {titleLabel} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="item-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Enter ${titleLabel.toLowerCase()}…`}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="item-sort"
                className="text-sm font-bold text-foreground"
              >
                Sort Order
              </Label>
              <Input
                id="item-sort"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          {showSubtitle && (
            <div className="space-y-2">
              <Label
                htmlFor="item-subtitle"
                className="text-sm font-bold text-foreground"
              >
                {subtitleLabel}
              </Label>
              <Input
                id="item-subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder={`Enter ${subtitleLabel.toLowerCase()}…`}
                className="h-11 rounded-xl"
              />
            </div>
          )}

          {showDescription && (
            <div className="space-y-2">
              <Label
                htmlFor="item-desc"
                className="text-sm font-bold text-foreground"
              >
                Description
              </Label>
              <textarea
                id="item-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/30 focus:ring-2 focus:border-primary transition-all"
                placeholder="Enter a brief description…"
              />
            </div>
          )}

          {showImage && (
            <div className="space-y-3">
              <Label className="text-sm font-bold text-foreground">
                Image / Media
              </Label>
              <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-border p-6 bg-slate-50/30">
                {imageUrl ? (
                  <div className="relative group mx-auto h-40 w-full max-w-sm overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-full w-full object-contain p-4"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => fileRef.current?.click()}
                        className="rounded-full h-10 w-10 p-0"
                      >
                        <Upload size={18} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex flex-col items-center justify-center h-40 rounded-xl bg-white border border-border shadow-sm hover:border-primary/50 transition-all group"
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <Upload size={20} />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Click to upload image
                    </span>
                  </button>
                )}

                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="…or paste image URL"
                    className="h-10 rounded-xl bg-white"
                  />
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-border">
            <input
              id="pub-item"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-5 w-5 rounded-lg border-slate-300 text-primary focus:ring-primary/20"
            />
            <Label
              htmlFor="pub-item"
              className="text-sm font-semibold text-foreground cursor-pointer select-none"
            >
              Published{" "}
              <span className="text-muted-foreground font-normal ml-1">
                — Visible on the public website
              </span>
            </Label>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-border flex justify-end gap-3 rounded-b-2xl">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl px-6 h-11 border-slate-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl px-8 h-11 shadow-lg shadow-primary/20"
          >
            {saving ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : null}
            {isNew ? "Create Item" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}
