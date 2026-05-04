import { createFileRoute } from "@tanstack/react-router";
import {
  Heart,
  Sparkles,
  MapPin,
  TrendingUp,
  Repeat,
  Building2,
  Globe2,
  Users,
} from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import aboutLeadership from "@/assets/about-leadership.jpg";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "JPCann Associates Limited is an award-winning boutique management consulting firm headquartered in Accra, Ghana, serving clients across Sub-Saharan Africa, the US and the UK.",
      },
      { property: "og:title", content: "About JPCann Associates" },
      {
        property: "og:description",
        content:
          "Award-winning boutique management consulting firm — advisory, BPO and capacity building across Sub-Saharan Africa.",
      },
      { property: "og:image", content: aboutLeadership },
      { name: "twitter:image", content: aboutLeadership },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const splitValues = [
  {
    letter: "S",
    icon: Heart,
    title: "Social Entrepreneurship",
    text: "The social benefits of our work are more important than the desire to make a profit.",
    color: "#ff4d4d", // Red
  },
  {
    letter: "P",
    icon: Sparkles,
    title: "Professionalism",
    text: "Our strength lies in our contemporary and exceptional professionalism towards our clients and each assignment.",
    color: "#4d94ff", // Blue
  },
  {
    letter: "L",
    icon: MapPin,
    title: "Local Emphasis",
    text: "We provide local solutions to our clients in the context of international best practices and standards.",
    color: "#00cc66", // Green
  },
  {
    letter: "I",
    icon: TrendingUp,
    title: "Improved Performance",
    text: "Our services are aimed at improving clients' performance, systems, and human capacity.",
    color: "#ffa31a", // Orange
  },
  {
    letter: "T",
    icon: Repeat,
    title: "Transformation",
    text: "Our belief is in transforming local businesses, human capacity, and raising corporate excellence.",
    color: "#9933ff", // Purple
  },
];

const overviewStats = [
  { icon: Building2, label: "Headquarters", value: "Accra, Ghana" },
  { icon: Globe2, label: "Reach", value: "Africa · US · UK" },
  { icon: Users, label: "Network", value: "Industry experts" },
];

function AboutPage() {
  const { data: pageData } = useQuery({
    queryKey: ["site_page", "about"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_pages")
        .select("*")
        .eq("page_key", "about")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow={pageData?.hero_eyebrow || "About us"}
        title={pageData?.hero_title || "Quiet expertise. Measurable impact."}
        description={
          pageData?.hero_description ||
          "An award-winning boutique management consulting firm — building capacity and strengthening institutions across emerging markets."
        }
      />

      {/* Company overview */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:px-6">
        <Reveal
          className="relative overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-elegant)]"
          variant="right"
        >
          <img
            src={aboutLeadership}
            alt="JPCann Associates partners discussing strategy with the Accra skyline behind them"
            loading="lazy"
            width={1600}
            height={1024}
            className="h-full w-full object-cover transition-transform duration-700 will-change-transform hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent" />
        </Reveal>
        <Reveal variant="left" delay="1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Company overview
          </p>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">
            A boutique firm with continental reach
          </h2>
          <div className="mt-6 space-y-5 text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">
                JPCann Associates Limited
              </span>{" "}
              is an award-winning boutique management consulting firm
              specializing in business advisory; business process outsourcing
              services; training, and capacity building. It is headquartered in
              Accra, Ghana, and operates in several African countries, the
              United States and the United Kingdom.
            </p>
            <p>
              <span className="font-semibold text-foreground">
                JPCann Associates Limited
              </span>
              's aim is to provide critically needed services for its clients in
              both the public and private sector to support and build their
              operational systems, and employees' capacities and modernize their
              operations efficiently.
            </p>
            <p>
              <span className="font-semibold text-foreground">
                JPCann Associates Limited
              </span>{" "}
              provides a pool of industry experts and highly qualified
              professionals in the discharge of its service delivery to clients
              across the Sub-Saharan Africa (SSA) region.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {overviewStats.map((s, i) => (
              <Reveal
                key={s.label}
                variant="up"
                delay={String(Math.min(4, i + 1)) as "1" | "2" | "3" | "4"}
                className="interactive-lift rounded-xl border border-border bg-card p-4"
              >
                <s.icon className="mb-2 h-5 w-5 text-primary" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {s.value}
                </p>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Mission & Vision */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2 md:px-6">
          <Reveal
            variant="up"
            className="interactive-lift relative overflow-hidden rounded-2xl border border-border bg-card p-10"
          >
            <div
              className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-2xl"
              style={{ background: "var(--gradient-primary)" }}
            />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Mission
            </p>
            <h3 className="mt-3 font-serif text-2xl text-foreground md:text-3xl">
              Transforming public and private sectors
            </h3>
            <p className="mt-5 text-muted-foreground">
              Our key mission is to transform the private and public sectors of
              emerging economies through the provision of consultancy and
              assurance services aimed at building and strengthening the
              capacities of both the private and public sector organizations in
              achieving improved performance.
            </p>
          </Reveal>

          <Reveal
            variant="up"
            delay="1"
            className="interactive-lift relative overflow-hidden rounded-2xl border border-border bg-card p-10"
          >
            <div
              className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full opacity-20 blur-2xl"
              style={{ background: "var(--gradient-primary)" }}
            />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Vision
            </p>
            <h3 className="mt-3 font-serif text-2xl text-foreground md:text-3xl">
              Strengthening institutions in emerging markets
            </h3>
            <p className="mt-5 text-muted-foreground">
              Our vision is to build capacity and strengthen and improve the
              performance of institutions in developing and emerging markets,
              especially in the sub-Saharan region of Africa.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core values - SPLIT */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <Reveal variant="up" className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Our core values
          </p>
          <h2 className="mt-3 font-serif text-3xl text-foreground md:text-4xl">
            The acronym <span className="text-primary">SPLIT</span> defines our
            core values
          </h2>
          <p className="mt-4 text-muted-foreground">
            Five principles that shape every engagement and every relationship
            we build.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {splitValues.map((v, i) => (
            <Reveal
              key={v.letter}
              variant="up"
              delay={String(Math.min(4, i)) as "0" | "1" | "2" | "3" | "4"}
              className="interactive-lift group relative overflow-hidden rounded-2xl border border-border bg-card p-6"
            >
              <div
                className="absolute -right-6 -top-6 font-serif text-[7rem] leading-none text-primary/10 transition-colors duration-500 group-hover:text-primary/20"
                aria-hidden
              >
                {v.letter}
              </div>
              <div
                className="relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: v.color }}
              >
                <v.icon size={20} />
              </div>
              <h3 className="relative font-serif text-lg text-foreground">
                {v.title}
              </h3>
              <p className="relative mt-2 text-sm text-muted-foreground">
                {v.text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
