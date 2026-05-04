import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { OutlineModal } from "@/components/OutlineModal";
import { supabase } from "@/integrations/supabase/client";

type TrainingDetail = {
  id: string;
  item_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  metadata: Record<string, unknown> & {
    thematic_area?: string;
    dates?: string[];
    venue?: string;
    register_url?: string;
    outline_path?: string;
    outline_filename?: string;
  };
};

export const Route = createFileRoute("/trainings/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("site_collections")
      .select("id,item_key,title,subtitle,description,image_url,metadata")
      .eq("collection_key", "trainings")
      .eq("item_key", params.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return data as TrainingDetail;
  },
  head: ({ loaderData }) => {
    const t = loaderData;
    if (!t) return { meta: [{ title: "Training — JPCann Associates" }] };
    return {
      meta: [
        { title: `${t.title} — JPCann Associates` },
        {
          name: "description",
          content:
            t.description ?? `Register for ${t.title} with JPCann Associates.`,
        },
        { property: "og:title", content: `${t.title} — JPCann Associates` },
        {
          property: "og:description",
          content: t.description ?? `Register for ${t.title}.`,
        },
        ...(t.image_url
          ? [
              { property: "og:image", content: t.image_url },
              { name: "twitter:image", content: t.image_url },
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
          Training not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          The training programme you are looking for is no longer available or
          the link is invalid.
        </p>
        <Link
          to="/trainings"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft size={16} /> Back to Trainings
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
          to="/trainings"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft size={16} /> Back to Trainings
        </Link>
      </div>
    </SiteLayout>
  ),
  component: TrainingDetailPage,
});

function TrainingDetailPage() {
  const t = Route.useLoaderData();
  const dates = Array.isArray(t.metadata?.dates)
    ? t.metadata!.dates!
    : [t.subtitle ?? ""];
  const venue =
    typeof t.metadata?.venue === "string"
      ? (t.metadata.venue as string)
      : "JPCann Associates Ltd. Premises";
  const registerUrl =
    typeof t.metadata?.register_url === "string"
      ? (t.metadata.register_url as string)
      : "https://tms.akauntability.net/public-actions/booking-form";
  const thematic =
    typeof t.metadata?.thematic_area === "string"
      ? (t.metadata.thematic_area as string)
      : null;
  const outlinePath =
    typeof t.metadata?.outline_path === "string"
      ? (t.metadata.outline_path as string)
      : null;
  const outlineFilename =
    typeof t.metadata?.outline_filename === "string"
      ? (t.metadata.outline_filename as string)
      : null;
  const [outlineOpen, setOutlineOpen] = useState(false);

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="relative overflow-hidden text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        {t.image_url && (
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 [background-position:center] [background-size:cover]"
            style={{ backgroundImage: `url(${t.image_url})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-foreground/70" />
        <Reveal
          className="relative mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32"
          variant="up"
        >
          <Link
            to="/trainings"
            className="story-link-soft inline-flex items-center gap-1 text-sm font-semibold text-primary-foreground/90 hover:text-accent"
          >
            <ArrowLeft size={14} /> All trainings
          </Link>
          {thematic && (
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {thematic}
            </p>
          )}
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight md:text-5xl">
            {t.title}
          </h1>
          {t.description && (
            <p className="mt-5 max-w-3xl text-base text-primary-foreground/85 md:text-lg">
              {t.description}
            </p>
          )}
        </Reveal>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:grid md:grid-cols-3 md:gap-10 md:px-6 md:py-20">
        <div className="md:col-span-2">
          <Reveal variant="up" className="space-y-6">
            <h2 className="font-serif text-2xl text-foreground">
              About this training
            </h2>
            <p className="text-muted-foreground">
              {t.description ??
                "Programme details will be available shortly. Contact our team for the full outline and learning objectives."}
            </p>

            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h3 className="font-serif text-lg text-foreground">
                What you will gain
              </h3>
              <ul className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                {[
                  "Practical, work-ready skills",
                  "Up-to-date methodologies and standards",
                  "Hands-on case studies and exercises",
                  "Certificate of participation",
                  "Networking with industry peers",
                  "Post-training support resources",
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

        {/* Sticky sidebar */}
        <aside className="mt-10 md:mt-0">
          <Reveal
            variant="scale"
            className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Scheduled dates
            </p>
            <ul className="mt-3 space-y-2">
              {dates.map((d) => (
                <li
                  key={d}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <Calendar size={14} className="text-accent" />
                  <span className="font-semibold">{d}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Venue
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm text-foreground">
              <MapPin size={14} className="mt-1 text-accent" />
              <span>{venue}</span>
            </p>

            <a
              href={registerUrl}
              target="_blank"
              rel="noreferrer"
              className="interactive-lift mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              Register now <ExternalLink size={14} />
            </a>
            <button
              type="button"
              onClick={() => setOutlineOpen(true)}
              className="interactive-lift mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/30 bg-background px-4 py-3 text-sm font-semibold text-primary shadow-sm transition-all hover:bg-secondary hover:shadow-md"
            >
              <FileText size={14} /> View Outline
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              You will be redirected to our secure booking platform.
            </p>
          </Reveal>
        </aside>
      </section>
      <OutlineModal
        open={outlineOpen}
        onOpenChange={setOutlineOpen}
        training={{
          id: t.id,
          slug: t.item_key,
          title: t.title,
          outlinePath,
          outlineFilename,
        }}
      />
    </SiteLayout>
  );
}
