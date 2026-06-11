import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { getDirectImageUrl } from "@/utils/image";
import { BrochureDownloadModal } from "@/components/BrochureDownloadModal";

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

export const Route = createFileRoute("/brochures/")({
  component: BrochuresPage,
  head: () => ({
    meta: [
      { title: "Training Brochures & Curriculums — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "Download expert business training brochures, course outlines, and curriculums from JPCann Associates.",
      },
    ],
  }),
});

function useBrochures() {
  const [data, setData] = useState<BrochureRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: rows, error } = await supabase
        .from("site_collections")
        .select("id,item_key,title,subtitle,description,image_url,metadata")
        .eq("collection_key", "brochures")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (!error && rows) setData(rows as BrochureRow[]);
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return { data, isLoading };
}

const PAGE_SIZE = 12;

function BrochuresPage() {
  const { data: brochures, isLoading } = useBrochures();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBrochure, setSelectedBrochure] = useState<BrochureRow | null>(
    null,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return brochures.filter(
      (b) =>
        !q ||
        b.title.toLowerCase().includes(q) ||
        (b.description ?? "").toLowerCase().includes(q),
    );
  }, [brochures, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () =>
      filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  useEffect(() => {
    setPage(1);
  }, [query]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Resources"
        title="Comprehensive Training Catalogues & Brochures"
        description="Browse our library of training programmes, curriculums, and corporate brochures. Download a copy today."
      />

      <section className="border-b border-border bg-card/40 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <BookOpen size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Library
              </p>
              <p className="font-serif text-lg text-foreground">
                Available Brochures
              </p>
            </div>
          </div>

          <div className="relative w-full md:max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brochures…"
              className="h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <p className="font-serif text-xl text-foreground">
              No brochures found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different search term.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((b, idx) => (
                <Reveal
                  key={b.id}
                  variant="up"
                  delay={String(idx % 3) as any}
                  data-magnetic="true"
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
                >
                  <div className="relative h-64 overflow-hidden bg-secondary/20">
                    <img
                      src={getDirectImageUrl(b.image_url)}
                      alt={b.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/0 to-foreground/0 opacity-40" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-xl font-semibold leading-snug text-foreground">
                      {b.title}
                    </h3>
                    {b.subtitle && (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-accent">
                        {b.subtitle}
                      </p>
                    )}
                    <p className="mt-4 flex-1 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                      {b.description}
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedBrochure(b)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 px-3 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                      >
                        <Download size={14} /> Download
                      </button>
                      <Link
                        to="/brochures/$slug"
                        params={{ slug: b.item_key }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-primary/30 bg-background py-2.5 px-3 text-xs font-semibold text-primary shadow-sm transition-all hover:bg-secondary hover:text-primary"
                      >
                        More Details
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            {totalPages > 1 && (
              <PaginationControls
                page={currentPage}
                totalPages={totalPages}
                onChange={setPage}
              />
            )}
          </>
        )}
      </section>

      <BrochureDownloadModal
        brochure={selectedBrochure}
        open={selectedBrochure !== null}
        onOpenChange={(open) => !open && setSelectedBrochure(null)}
      />
    </SiteLayout>
  );
}

function PaginationControls({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  return (
    <nav className="mt-12 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="inline-flex h-10 items-center gap-1 rounded-md border border-border px-4 text-sm font-medium transition-all hover:border-primary disabled:opacity-40"
      >
        <ChevronLeft size={16} /> Previous
      </button>
      <span className="text-sm font-medium">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="inline-flex h-10 items-center gap-1 rounded-md border border-border px-4 text-sm font-medium transition-all hover:border-primary disabled:opacity-40"
      >
        Next <ChevronRight size={16} />
      </button>
    </nav>
  );
}
