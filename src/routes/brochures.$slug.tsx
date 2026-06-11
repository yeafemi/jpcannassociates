import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { BrochureDownloadModal } from "@/components/BrochureDownloadModal";
import { supabase } from "@/integrations/supabase/client";
import { getDirectImageUrl } from "@/utils/image";

type BrochureRow = {
  id: string;
  item_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  metadata: Record<string, unknown> & {
    file_path?: string;
    file_filename?: string;
  };
};

export const Route = createFileRoute("/brochures/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("site_collections")
      .select("id,item_key,title,subtitle,description,image_url,metadata")
      .eq("collection_key", "brochures")
      .eq("item_key", params.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return data as BrochureRow;
  },
  head: ({ loaderData }) => {
    const t = loaderData;
    if (!t) return { meta: [{ title: "Brochure — JPCann Associates" }] };
    return {
      meta: [
        { title: `${t.title} — JPCann Associates` },
        {
          name: "description",
          content:
            t.description ??
            `Download ${t.title} brochure from JPCann Associates.`,
        },
        { property: "og:title", content: `${t.title} — JPCann Associates` },
        {
          property: "og:description",
          content: t.description ?? `Download ${t.title} brochure.`,
        },
        ...(t.image_url
          ? [
              { property: "og:image", content: getDirectImageUrl(t.image_url) },
              {
                name: "twitter:image",
                content: getDirectImageUrl(t.image_url),
              },
              { name: "twitter:card", content: "summary_large_image" },
            ]
          : []),
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-32 text-center md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          404
        </p>
        <h1 className="mt-3 font-serif text-3xl text-foreground">
          Brochure not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          The training brochure you are looking for is no longer available or
          the link is invalid.
        </p>
        <Link
          to="/brochures"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft size={16} /> Back to Brochures
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-32 text-center md:px-6">
        <h1 className="font-serif text-3xl text-foreground">
          Something went wrong
        </h1>
        <p className="mt-3 text-muted-foreground">{error.message}</p>
        <Link
          to="/brochures"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft size={16} /> Back to Brochures
        </Link>
      </div>
    </SiteLayout>
  ),
  component: BrochureDetailPage,
});

function BrochureDetailPage() {
  const t = Route.useLoaderData();
  const [downloadOpen, setDownloadOpen] = useState(false);

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="relative overflow-hidden text-primary-foreground min-h-[340px] flex items-center"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Cover image as background blended with the gradient */}
        {t.image_url && (
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none"
            style={{
              backgroundImage: `url(${getDirectImageUrl(t.image_url)})`,
            }}
          />
        )}

        {/* Soft dark and color-matched gradient overlays to ensure text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

        <Reveal
          className="relative mx-auto max-w-7xl w-full px-4 py-20 md:px-6 md:py-24"
          variant="up"
        >
          <Link
            to="/brochures"
            className="story-link-soft inline-flex items-center gap-1.5 text-sm font-semibold text-primary-foreground/90 hover:text-accent transition-colors"
          >
            <ArrowLeft size={15} /> All brochures
          </Link>
          {t.subtitle && (
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {t.subtitle}
            </p>
          )}
          <h1 className="mt-3 font-serif text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl max-w-4xl">
            {t.title}
          </h1>
        </Reveal>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:grid md:grid-cols-3 md:gap-10 md:px-6 md:py-16">
        <div className="md:col-span-2">
          <Reveal variant="up" className="space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-foreground border-b border-border/60 pb-3">
              About this training brochure
            </h2>
            <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm md:text-base pr-4">
              {t.description ?? "No description available."}
            </div>
          </Reveal>
        </div>

        {/* Sticky sidebar */}
        <aside className="mt-8 md:mt-0">
          <Reveal
            variant="scale"
            className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-md"
          >
            {/* Brochure Cover Image in sidebar (full and uncropped) */}
            {t.image_url && (
              <div className="mb-6 overflow-hidden rounded-xl border border-border bg-muted/30 p-2 flex items-center justify-center">
                <img
                  src={getDirectImageUrl(t.image_url)}
                  alt={t.title}
                  className="w-full max-h-[340px] object-contain rounded-lg transition-transform duration-500 hover:scale-102 shadow-sm"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setDownloadOpen(true)}
              className="interactive-lift inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md cursor-pointer"
            >
              <Download size={15} /> Download Brochure
            </button>
          </Reveal>
        </aside>
      </section>

      <BrochureDownloadModal
        brochure={t}
        open={downloadOpen}
        onOpenChange={setDownloadOpen}
      />
    </SiteLayout>
  );
}
