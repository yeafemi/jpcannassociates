import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trophy, ArrowRight, Loader2 } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { getDirectImageUrl } from "@/utils/image";

type AwardRow = {
  id: string;
  item_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  metadata: Record<string, unknown> & {
    gallery?: string[];
  };
};

export const Route = createFileRoute("/awards/")({
  component: AwardsIndexPage,
  head: () => ({
    meta: [
      { title: "Awards & Achievements — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "Explore the awards, recognition, and certifications JPCann Associates has received for excellence in advisory, outsourcing, and training.",
      },
    ],
  }),
});

function AwardsIndexPage() {
  const [awards, setAwards] = useState<AwardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("site_collections")
          .select("id,item_key,title,subtitle,description,image_url,metadata")
          .eq("collection_key", "awards")
          .eq("is_published", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (!error && data && !cancelled) {
          setAwards(data as AwardRow[]);
        }
      } catch (e) {
        console.error("Error loading awards", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Achievements"
        title="Awards & Recognition"
        description="Our milestones, accrediting associations, and institutional awards validating our dedication to business excellence and professional development."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-sm text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
            Loading awards and honors…
          </div>
        ) : awards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/40 p-16 text-center backdrop-blur">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Trophy size={24} />
            </div>
            <p className="font-serif text-xl font-bold mt-4 text-foreground">
              No awards listed yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              We are constantly working to deliver exceptional results. Check
              back soon for updates on our achievements.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {awards.map((award, idx) => (
              <Reveal
                key={award.id}
                variant="up"
                delay={String(idx % 3) as any}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-secondary/10">
                  {award.image_url ? (
                    <img
                      src={getDirectImageUrl(award.image_url)}
                      alt={award.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
                      <Trophy size={48} className="stroke-[1.25]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-30" />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-xl font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {award.title}
                  </h3>
                  {award.subtitle && (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-accent">
                      {award.subtitle}
                    </p>
                  )}
                  <p className="mt-4 flex-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {award.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {award.metadata?.gallery?.length || 0} Gallery photos
                    </span>
                    <Link
                      to="/awards/$slug"
                      params={{ slug: award.item_key }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group/link hover:underline"
                    >
                      View Details
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover/link:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
