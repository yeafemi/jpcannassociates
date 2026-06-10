import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  Search,
} from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { getDirectImageUrl } from "@/utils/image";
import handshakeImg from "@/assets/portfolio-handshake.jpg";

const CATEGORIES = [
  { value: "All", label: "All Categories" },
  { value: "BAS", label: "Business Advisory Services (BAS)" },
  { value: "Training", label: "Training & Capacity Building" },
  { value: "BPO", label: "Business Process Outsourcing" },
] as const;

type CategoryValue = (typeof CATEGORIES)[number]["value"];

type PortfolioRow = {
  id: string;
  item_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  metadata: Record<string, unknown> & {
    category?: string;
    client?: string;
    funder?: string | null;
    date?: string;
    location?: string;
    sector?: string;
  };
};

export const Route = createFileRoute("/portfolio/")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "Portfolio — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "Selected engagements delivered by JPCann Associates across Business Advisory Services, Training & Capacity Building, and Business Process Outsourcing.",
      },
      { property: "og:title", content: "Portfolio — JPCann Associates" },
      {
        property: "og:description",
        content: "Selected engagements and outcomes from across West Africa.",
      },
      { property: "og:image", content: handshakeImg },
      { name: "twitter:image", content: handshakeImg },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function usePortfolio() {
  const [data, setData] = useState<PortfolioRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: rows, error } = await supabase
        .from("site_collections")
        .select("id,item_key,title,subtitle,description,image_url,metadata")
        .eq("collection_key", "portfolio")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (!error && rows) setData(rows as PortfolioRow[]);
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return { data, isLoading };
}

const PAGE_SIZE = 6;

function PortfolioPage() {
  const { data: items, isLoading } = usePortfolio();
  const [category, setCategory] = useState<CategoryValue>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesCat =
        category === "All" || it.metadata?.category === category;
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        it.title.toLowerCase().includes(q) ||
        (it.description ?? "").toLowerCase().includes(q) ||
        (it.metadata?.client ?? "").toString().toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [items, category, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () =>
      filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, query]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Portfolio"
        title="Selected engagements."
        description="A representative sample of the work we deliver across advisory, training and outsourcing. Filter by category to explore."
      />

      {/* Filter bar */}
      <section className="border-b border-border bg-card/40 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Filter size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Filter
              </p>
              <p className="font-serif text-lg text-foreground">
                Service Category
              </p>
            </div>
          </div>

          <div className="grid w-full gap-3 md:max-w-2xl md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search portfolio…"
                className="h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryValue)}
              className="h-11 min-w-[16rem] cursor-pointer rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Filter by service category"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <Reveal
          className="mb-12 overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-elegant)]"
          variant="scale"
        >
          <img
            src={handshakeImg}
            alt="A JPCann partner closing a client engagement with a handshake"
            loading="lazy"
            width={1600}
            height={1024}
            className="h-72 w-full object-cover md:h-96"
          />
        </Reveal>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <p className="font-serif text-xl text-foreground">
              No projects found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different category or search term.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-baseline justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "project" : "projects"}
                {category !== "All" && (
                  <>
                    {" "}
                    in{" "}
                    <span className="font-semibold text-foreground">
                      {CATEGORIES.find((c) => c.value === category)?.label}
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((item, idx) => (
                <PortfolioCard key={item.id} item={item} index={idx} />
              ))}
            </div>
            {totalPages > 1 && (
              <PaginationControls
                page={currentPage}
                totalPages={totalPages}
                onChange={(p) => {
                  setPage(p);
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />
            )}
          </>
        )}
      </section>
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
  const pages = useMemo(() => {
    const arr: (number | "…")[] = [];
    const add = (n: number | "…") => arr.push(n);
    const window = 1; // pages around current
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - window && i <= page + window)
      ) {
        add(i);
      } else if (arr[arr.length - 1] !== "…") {
        add("…");
      }
    }
    return arr;
  }, [page, totalPages]);

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="inline-flex h-10 items-center gap-1 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} /> Prev
      </button>
      <ul className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <li
              key={`e-${i}`}
              className="px-2 text-sm text-muted-foreground"
              aria-hidden
            >
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={
                  p === page
                    ? "h-10 min-w-10 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm"
                    : "h-10 min-w-10 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary"
                }
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="inline-flex h-10 items-center gap-1 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        Next <ChevronRight size={16} />
      </button>
    </nav>
  );
}

function PortfolioCard({ item, index }: { item: PortfolioRow; index: number }) {
  const delay = (["0", "1", "2", "3", "4"] as const)[index % 5];
  const slug = item.item_key;
  const client =
    typeof item.metadata?.client === "string" ? item.metadata.client : null;
  const date =
    typeof item.metadata?.date === "string" ? item.metadata.date : null;
  const location =
    typeof item.metadata?.location === "string" ? item.metadata.location : null;
  const category =
    typeof item.metadata?.category === "string" ? item.metadata.category : null;
  const categoryLabel =
    CATEGORIES.find((c) => c.value === category)?.label.replace(
      /\s\(.*\)$/,
      "",
    ) ?? category;

  return (
    <Reveal
      variant="up"
      delay={delay}
      className="group interactive-lift relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
    >
      <Link
        to="/portfolio/$slug"
        params={{ slug }}
        className="block"
        aria-label={item.title}
      >
        <div className="relative h-52 overflow-hidden">
          <img
            src={getDirectImageUrl(item.image_url)}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/0 to-foreground/0 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
          {categoryLabel && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary backdrop-blur">
              <Briefcase size={11} /> {categoryLabel}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <Link to="/portfolio/$slug" params={{ slug }}>
          <h2 className="font-serif text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {item.title}
          </h2>
        </Link>
        {client && (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {client}
          </p>
        )}
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          {date && (
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-accent" />
              <span className="text-xs">{date}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-accent" />
              <span className="text-xs">{location}</span>
            </div>
          )}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <Link
            to="/portfolio/$slug"
            params={{ slug }}
            className="story-link-soft inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            View case study <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
