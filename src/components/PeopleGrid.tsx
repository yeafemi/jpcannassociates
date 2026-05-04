import { useEffect, useMemo, useState } from "react";
import { Search, UserRound } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";

export type PersonRow = {
  id: string;
  item_key: string;
  title: string; // Full Name
  subtitle: string | null; // Role
  image_url: string | null;
  sort_order: number;
};

// eslint-disable-next-line react-refresh/only-export-components
export function usePeople(
  collectionKey: "staff" | "management" | "facilitators",
) {
  const [data, setData] = useState<PersonRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: rows, error } = await supabase
        .from("site_collections")
        .select("id,item_key,title,subtitle,image_url,sort_order")
        .eq("collection_key", collectionKey)
        .eq("is_published", true)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (!error && rows) setData(rows as PersonRow[]);
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [collectionKey]);
  return { data, isLoading };
}

export function PeopleGrid({
  people,
  columns = 4,
}: {
  people: PersonRow[];
  columns?: 4 | 5;
}) {
  const colClass =
    columns === 5
      ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      : "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4";
  return (
    <div className={colClass}>
      {people.map((p, idx) => {
        const delay = (["0", "1", "2", "3", "4"] as const)[idx % 5];
        return (
          <Reveal
            key={p.id}
            variant="up"
            delay={delay}
            data-magnetic="true"
            className="group interactive-lift relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-secondary/40">
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <UserRound size={64} strokeWidth={1.25} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-foreground/0 opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h2 className="font-serif text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                {p.title}
              </h2>
              {p.subtitle && (
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
                  {p.subtitle}
                </p>
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

export function PeopleSearchBar({
  query,
  onQuery,
  placeholder,
}: {
  query: string;
  onQuery: (q: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full md:max-w-md">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFilteredPeople(people: PersonRow[], query: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.subtitle ?? "").toLowerCase().includes(q),
    );
  }, [people, query]);
}
