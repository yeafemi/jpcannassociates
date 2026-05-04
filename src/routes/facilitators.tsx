import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import {
  PeopleGrid,
  PeopleSearchBar,
  usePeople,
  useFilteredPeople,
} from "@/components/PeopleGrid";

export const Route = createFileRoute("/facilitators")({
  component: FacilitatorsPage,
  head: () => ({
    meta: [
      { title: "Our Facilitators — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "Meet the expert facilitators and trainers at JPCann Associates who deliver world-class training programmes across West Africa.",
      },
      { property: "og:title", content: "Our Facilitators — JPCann Associates" },
      {
        property: "og:description",
        content:
          "The expert trainers and facilitators behind JPCann's world-class training programmes.",
      },
    ],
  }),
});

function FacilitatorsPage() {
  const { data, isLoading } = usePeople("facilitators");
  const [query, setQuery] = useState("");
  const filtered = useFilteredPeople(data, query);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our People"
        title="Meet our facilitators."
        description="A team of seasoned experts and industry practitioners who design and deliver our training programmes with excellence."
      />

      <section className="border-b border-border bg-card/40 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Directory
            </p>
            <p className="font-serif text-lg text-foreground">
              All facilitators
            </p>
          </div>
          <PeopleSearchBar
            query={query}
            onQuery={setQuery}
            placeholder="Search by name or role…"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <p className="font-serif text-xl text-foreground">
              No facilitators to show yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon — facilitator profiles will appear here.
            </p>
          </div>
        ) : (
          <PeopleGrid people={filtered} columns={5} />
        )}
      </section>
    </SiteLayout>
  );
}
