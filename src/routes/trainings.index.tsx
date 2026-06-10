import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  MapPin,
  FileText,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { OutlineModal, type OutlineTraining } from "@/components/OutlineModal";
import { supabase } from "@/integrations/supabase/client";
import { getDirectImageUrl } from "@/utils/image";

const THEMATIC_AREAS = [
  "All Thematic Areas",
  "Board, Executive & Senior Management",
  "Sustainability, Climate Risks & ESG",
  "Leadership & Managerial Skills",
  "Human Resource Management",
  "Banking & Financial Services",
  "Artificial Intelligence (AI), Data Analysis & Digital Marketing",
  "Information, Communication & Technology",
  "Accounting & Finance",
  "Governance, Risk & Compliance (GRC)",
  "Health, Safety & Environment",
  "General",
  "Public Sector Management",
  "Certified & Professional",
  "Certified Courses - SIMS",
  "In-House",
] as const;

type TrainingRow = {
  id: string;
  item_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  metadata: Record<string, unknown> & {
    thematic_area?: string;
    outline_path?: string;
    outline_filename?: string;
  };
};

export const Route = createFileRoute("/trainings/")({
  component: TrainingsPage,
  head: () => ({
    meta: [
      { title: "Trainings — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "Browse JPCann Associates trainings across leadership, ESG, AI, GRC, HR, HSE and more. Filter by thematic area and register online.",
      },
      { property: "og:title", content: "Trainings — JPCann Associates" },
      {
        property: "og:description",
        content:
          "Workshops, certifications and professional programmes — filter by thematic area.",
      },
    ],
  }),
});

function useTrainings() {
  const [data, setData] = useState<TrainingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: rows, error } = await supabase
        .from("site_collections")
        .select(
          "id,item_key,title,subtitle,description,image_url,link_url,metadata",
        )
        .eq("collection_key", "trainings")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (!error && rows) setData(rows as TrainingRow[]);
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return { data, isLoading };
}

function parseTrainingDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split(/[-–]/);
  const lastPart = parts[parts.length - 1].trim();
  const d = new Date(lastPart);
  if (!isNaN(d.getTime())) return d;

  const d2 = new Date(dateStr);
  if (!isNaN(d2.getTime())) return d2;

  return null;
}

const PAGE_SIZE = 12;

function TrainingsPage() {
  const { data: trainings, isLoading } = useTrainings();
  const [area, setArea] =
    useState<(typeof THEMATIC_AREAS)[number]>("All Thematic Areas");
  const [statusFilter, setStatusFilter] = useState<
    "upcoming" | "completed" | "all"
  >("upcoming");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [outlineTraining, setOutlineTraining] =
    useState<OutlineTraining | null>(null);

  const openOutline = (t: TrainingRow) => {
    setOutlineTraining({
      id: t.id,
      slug: t.item_key,
      title: t.title,
      outlinePath:
        typeof t.metadata?.outline_path === "string"
          ? t.metadata.outline_path
          : null,
      outlineFilename:
        typeof t.metadata?.outline_filename === "string"
          ? t.metadata.outline_filename
          : null,
    });
  };

  const filtered = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const sortedTrainings = [...trainings].sort((a, b) => {
      const dateA = parseTrainingDate(a.subtitle);
      const dateB = parseTrainingDate(b.subtitle);

      const timeA = dateA ? dateA.getTime() : 8640000000000000;
      const timeB = dateB ? dateB.getTime() : 8640000000000000;

      return timeA - timeB;
    });

    return sortedTrainings.filter((t) => {
      const matchesArea =
        area === "All Thematic Areas" || t.metadata?.thematic_area === area;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q);

      let matchesStatus = true;
      if (statusFilter !== "all") {
        const tDate = parseTrainingDate(t.subtitle);
        if (!tDate) {
          matchesStatus = statusFilter === "upcoming";
        } else {
          if (statusFilter === "completed") {
            matchesStatus = tDate < now;
          } else if (statusFilter === "upcoming") {
            matchesStatus = tDate >= now;
          }
        }
      }

      return matchesArea && matchesQuery && matchesStatus;
    });
  }, [trainings, area, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () =>
      filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  useEffect(() => {
    setPage(1);
  }, [area, query, statusFilter]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Trainings"
        title="Learn with leaders. Grow with standards."
        description="Industry-leading workshops, certifications and professional programmes. Filter by thematic area and reserve your seat — places are limited."
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
                Thematic Areas
              </p>
            </div>
          </div>

          <div className="grid w-full gap-3 md:max-w-3xl md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search trainings…"
                className="h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "upcoming" | "completed",
                )
              }
              className="h-11 min-w-[12rem] cursor-pointer rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Filter by status"
            >
              <option value="upcoming">Upcoming Trainings</option>
              <option value="completed">Completed Trainings</option>
              <option value="all">All Trainings</option>
            </select>
            <select
              value={area}
              onChange={(e) =>
                setArea(e.target.value as (typeof THEMATIC_AREAS)[number])
              }
              className="h-11 min-w-[14rem] cursor-pointer rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Filter by thematic area"
            >
              {THEMATIC_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
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
              No trainings found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different thematic area or search term.
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
                {filtered.length === 1 ? "programme" : "programmes"}
                {area !== "All Thematic Areas" && (
                  <>
                    {" "}
                    in{" "}
                    <span className="font-semibold text-foreground">
                      {area}
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((t, idx) => (
                <TrainingCard
                  key={t.id}
                  training={t}
                  index={idx}
                  onViewOutline={() => openOutline(t)}
                />
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
      <OutlineModal
        open={outlineTraining !== null}
        onOpenChange={(o) => !o && setOutlineTraining(null)}
        training={outlineTraining}
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
  const pages = useMemo(() => {
    const arr: (number | "…")[] = [];
    const window = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - window && i <= page + window)
      ) {
        arr.push(i);
      } else if (arr[arr.length - 1] !== "…") {
        arr.push("…");
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

function TrainingCard({
  training,
  index,
  onViewOutline,
}: {
  training: TrainingRow;
  index: number;
  onViewOutline: () => void;
}) {
  const delay = (["0", "1", "2", "3", "4"] as const)[index % 5];
  const slug = training.item_key;
  const dates = training.subtitle ?? "";
  const venue =
    typeof training.metadata?.venue === "string"
      ? (training.metadata.venue as string)
      : "JPCann Associates Ltd. Premises";

  return (
    <Reveal
      variant="up"
      delay={delay}
      className="group interactive-lift relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
    >
      <Link
        to="/trainings/$slug"
        params={{ slug }}
        className="block"
        aria-label={training.title}
      >
        <div className="relative h-52 overflow-hidden">
          <img
            src={getDirectImageUrl(training.image_url)}
            alt={training.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-foreground/0 to-foreground/0 opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
          {training.metadata?.thematic_area && (
            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary backdrop-blur">
              {String(training.metadata.thematic_area).split(",")[0]}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <Link to="/trainings/$slug" params={{ slug }}>
          <h3 className="font-serif text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {training.title}
          </h3>
        </Link>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-accent">
            <Calendar size={14} />
            <span className="font-semibold text-foreground/80">{dates}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span className="text-xs">{venue}</span>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <button
            type="button"
            onClick={onViewOutline}
            className="story-link-soft inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            <FileText size={14} /> View Outline
          </button>
          <a
            href="https://tms.akauntability.net/public-actions/booking-form"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            Register
          </a>
        </div>
      </div>
    </Reveal>
  );
}
