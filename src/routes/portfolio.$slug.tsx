import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Landmark,
  MapPin,
  Tag,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { getDirectImageUrl } from "@/utils/image";

type PortfolioDetail = {
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
    year?: string;
    date?: string;
    location?: string;
    sector?: string;
  };
};

const CATEGORY_LABELS: Record<string, string> = {
  BAS: "Business Advisory Services",
  Training: "Training & Capacity Building",
  BPO: "Business Process Outsourcing",
};

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("site_collections")
      .select("id,item_key,title,subtitle,description,image_url,metadata")
      .eq("collection_key", "portfolio")
      .eq("item_key", params.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return data as PortfolioDetail;
  },
  head: ({ loaderData }) => {
    const p = loaderData;
    if (!p) return { meta: [{ title: "Project — JPCann Associates" }] };
    return {
      meta: [
        { title: `${p.title} — JPCann Associates` },
        {
          name: "description",
          content: p.description?.slice(0, 160) ?? `Case study: ${p.title}.`,
        },
        { property: "og:title", content: `${p.title} — JPCann Associates` },
        {
          property: "og:description",
          content: p.description?.slice(0, 160) ?? `Case study: ${p.title}.`,
        },
        ...(p.image_url
          ? [
              { property: "og:image", content: getDirectImageUrl(p.image_url) },
              { name: "twitter:image", content: getDirectImageUrl(p.image_url) },
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
          Project not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          The case study you are looking for is no longer available or the link
          is invalid.
        </p>
        <Link
          to="/portfolio"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft size={16} /> Back to Portfolio
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
          to="/portfolio"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </div>
    </SiteLayout>
  ),
  component: PortfolioDetailPage,
});

function PortfolioDetailPage() {
  const p = Route.useLoaderData();
  const m = p.metadata ?? {};
  const category = typeof m.category === "string" ? m.category : null;
  const categoryLabel =
    (category && CATEGORY_LABELS[category]) ?? category ?? "Engagement";
  const client = typeof m.client === "string" ? m.client : null;
  const funder = typeof m.funder === "string" ? m.funder : null;
  const date =
    (typeof m.year === "string" ? m.year : null) ??
    (typeof m.date === "string" ? m.date : null);
  const location = typeof m.location === "string" ? m.location : null;
  const sector = typeof m.sector === "string" ? m.sector : null;

  const paragraphs = (p.description ?? "")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="relative overflow-hidden text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        {p.image_url && (
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 [background-position:center] [background-size:cover]"
            style={{ backgroundImage: `url(${getDirectImageUrl(p.image_url)})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-foreground/70" />
        <Reveal
          className="relative mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32"
          variant="up"
        >
          <Link
            to="/portfolio"
            className="story-link-soft inline-flex items-center gap-1 text-sm font-semibold text-primary-foreground/90 hover:text-accent"
          >
            <ArrowLeft size={14} /> All projects
          </Link>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur">
            <Briefcase size={12} /> {categoryLabel}
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-5xl">
            {p.title}
          </h1>
          {p.subtitle && (
            <p className="mt-4 text-lg font-medium text-primary-foreground/80 max-w-2xl">
              {p.subtitle}
            </p>
          )}
          {client && (
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/85">
              Client: {client}
            </p>
          )}
        </Reveal>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:grid md:grid-cols-3 md:gap-10 md:px-6 md:py-20">
        <div className="md:col-span-2">
          <Reveal variant="up" className="space-y-6">
            <h2 className="font-serif text-2xl text-foreground">
              About this engagement
            </h2>
            {paragraphs.length > 0 ? (
              paragraphs.map((para, i) => (
                <p key={i} className="leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">
                Project details will be available shortly. Contact our team for
                the full case study.
              </p>
            )}

            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h3 className="font-serif text-lg text-foreground">
                How we delivered value
              </h3>
              <ul className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                {[
                  "Discovery & stakeholder consultation",
                  "Benchmarking against international standards",
                  "Tailored frameworks & deliverables",
                  "Hands-on capacity building",
                  "Implementation roadmap",
                  "Post-engagement support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Sidebar */}
        <aside className="mt-10 md:mt-0">
          <Reveal
            variant="scale"
            className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Project snapshot
            </p>

            <dl className="mt-4 space-y-4 text-sm">
              {client && (
                <div className="flex items-start gap-3">
                  <Building2
                    size={16}
                    className="mt-0.5 shrink-0 text-accent"
                  />
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Client
                    </dt>
                    <dd className="font-semibold text-foreground">{client}</dd>
                  </div>
                </div>
              )}
              {funder && (
                <div className="flex items-start gap-3">
                  <Landmark size={16} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Funder
                    </dt>
                    <dd className="font-semibold text-foreground">{funder}</dd>
                  </div>
                </div>
              )}
              {date && (
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Period
                    </dt>
                    <dd className="font-semibold text-foreground">{date}</dd>
                  </div>
                </div>
              )}
              {location && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Location
                    </dt>
                    <dd className="font-semibold text-foreground">
                      {location}
                    </dd>
                  </div>
                </div>
              )}
              {sector && (
                <div className="flex items-start gap-3">
                  <Tag size={16} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Sector
                    </dt>
                    <dd className="font-semibold text-foreground">{sector}</dd>
                  </div>
                </div>
              )}
            </dl>

            <Link
              to="/contact"
              className="interactive-lift mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              Discuss a similar engagement
            </Link>
          </Reveal>
        </aside>
      </section>
    </SiteLayout>
  );
}
