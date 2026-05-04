import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import {
  PeopleGrid,
  PeopleSearchBar,
  usePeople,
  useFilteredPeople,
} from "@/components/PeopleGrid";

export const Route = createFileRoute("/management")({
  component: ManagementPage,
  head: () => ({
    meta: [
      { title: "Management Team — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "The leadership of JPCann Associates Limited — partners and directors guiding our advisory, BPO and training practice.",
      },
      { property: "og:title", content: "Management Team — JPCann Associates" },
      {
        property: "og:description",
        content: "Senior leaders steering JPCann Associates Limited.",
      },
    ],
  }),
});

function ManagementPage() {
  const { data, isLoading } = usePeople("management");
  const [query, setQuery] = useState("");
  const filtered = useFilteredPeople(data, query);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Leadership"
        title="Our management team."
        description="The partners and directors who set our standards and steer every engagement."
      />

      <section className="border-b border-border bg-card/40 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Directory
            </p>
            <p className="font-serif text-lg text-foreground">
              Leadership team
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              No management profiles yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Leadership profiles will appear here once added from the admin
              dashboard.
            </p>
          </div>
        ) : (
          <PeopleGrid people={filtered} />
        )}
      </section>
    </SiteLayout>
  );
}
