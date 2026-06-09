import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Search,
  Activity,
  Target,
  Zap,
  Flag,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
  Layers,
} from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/approach")({
  component: ApproachPage,
  head: () => ({
    meta: [
      { title: "Our Approach — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "Our structured 5-phase methodology ensures transparency, accountability, and measurable results through collaborative transformation.",
      },
    ],
  }),
});

const methodology = [
  {
    phase: "Phase 1",
    title: "Discovery & Initiation",
    desc: "We listen first. Through stakeholder interviews, data collection, and kick-off workshops, we build a shared understanding of your current state, goals, and pain points.",
    icon: Search,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    phase: "Phase 2",
    title: "Diagnosis & Analysis",
    desc: "We go beneath the surface. Using root cause analysis, process mapping, and benchmarking, we identify what is really driving your challenges—not just the symptoms.",
    icon: Activity,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    phase: "Phase 3",
    title: "Strategy & Action Planning",
    desc: "We build a clear roadmap. Together, we develop actionable solutions, evaluate alternative paths, define KPIs, and create a step-by-step implementation plan.",
    icon: Target,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    phase: "Phase 4",
    title: "Implementation Support",
    desc: "We stay alongside you. From training and change management to hands-on project support, we ensure execution happens and changes take root.",
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    phase: "Phase 5",
    title: "Closure & Evaluation",
    desc: "We transition ownership. A post-implementation review, ROI analysis, and structured knowledge transfer ensure your team sustains the gains long after we leave.",
    icon: Flag,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
];

function ApproachPage() {
  const { data: pageData } = useQuery({
    queryKey: ["site_page", "approach"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_pages")
        .select("*")
        .eq("page_key", "approach")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow={pageData?.hero_eyebrow || "Methodology"}
        title={pageData?.hero_title || "Collaborative Transformation"}
        description={
          pageData?.hero_description ||
          "We don't deliver generic advice. We partner with you to co-create solutions that stick through a structured, results-driven process."
        }
      />

      {/* Intro Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-full w-full max-w-7xl opacity-[0.03]">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <Reveal variant="up">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-8">
              Moving from where you are to <br />
              <span className="text-primary italic">where you need to be.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Our structured 5-phase methodology ensures transparency,
              accountability, and measurable results from start to finish. We
              bridge the gap between strategy and execution by being deeply
              involved in the implementation journey.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-12 text-center" variant="up">
            <h2 className="font-serif text-3xl md:text-5xl mb-6">
              The 5-Phase Methodology
            </h2>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-primary/20">
              <div className="h-full w-12 rounded-full bg-primary" />
            </div>
          </Reveal>

          <div className="relative space-y-12">
            {/* Connection Line (Desktop) */}
            <div className="absolute left-[2.75rem] top-10 bottom-10 hidden w-0.5 bg-linear-to-b from-blue-200 via-indigo-200 to-emerald-200 lg:block" />

            {methodology.map((m, i) => (
              <Reveal
                key={m.phase}
                variant="right"
                delay={String(Math.min(i, 4)) as any}
                className="relative"
              >
                <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
                  {/* Phase Marker */}
                  <div
                    className={cn(
                      "relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border-2 shadow-sm transition-transform hover:scale-110",
                      m.bg,
                      m.color,
                      m.border,
                    )}
                  >
                    <m.icon size={32} />
                    <div className="absolute -right-3 -top-3 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight border border-border shadow-xs">
                      {m.phase}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="group rounded-3xl border border-border bg-card p-8 md:p-10 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
                    <h3 className="font-serif text-2xl md:text-3xl mb-4 text-foreground group-hover:text-primary transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
                      {m.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Works Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <Reveal variant="right">
              <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-8">
                Why This <span className="text-accent italic">Works</span>
              </h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Structured but flexible",
                    desc: "The phases are clear, but we adapt to your pace and priorities. No rigid templates—just rigorous thinking applied to your unique context.",
                    icon: Layers,
                  },
                  {
                    title: "Client involved at every step",
                    desc: "No surprises. No black boxes. True partnership means we co-create solutions so you own the outcome as much as we do.",
                    icon: Users,
                  },
                  {
                    title: "Designed for sustainability",
                    desc: "We build your capability, not your dependency. Our goal is to leave your team stronger and more capable than when we arrived.",
                    icon: ShieldCheck,
                  },
                ].map((item, i) => (
                  <div key={item.title} className="flex gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal variant="left" className="relative">
              <div className="aspect-square rounded-3xl bg-slate-900 p-12 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 h-full w-full opacity-20">
                  <div className="absolute top-10 right-10 h-32 w-32 rounded-full border-4 border-dashed border-white/20 animate-spin-slow" />
                </div>

                <h3 className="font-serif text-3xl md:text-4xl mb-8 relative">
                  Real results start with a <br />
                  <span className="text-primary italic">conversation.</span>
                </h3>

                <p className="text-lg text-slate-400 mb-10 relative">
                  Ready to transform complexity into results? Let's discuss how
                  our 5-phase approach can work for your organisation.
                </p>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-primary/90 hover:translate-x-2 relative group w-fit"
                >
                  Get Started{" "}
                  <ArrowRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              {/* Decorative Floating Element */}
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-3xl bg-accent/20 backdrop-blur-xl -z-10 animate-bounce-slow" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Final Achievement Banner */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal
            variant="scale"
            className="rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 p-12 text-center text-white shadow-2xl shadow-blue-500/20"
          >
            <CheckCircle2 size={48} className="mx-auto mb-6 text-accent" />
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              Built for Excellence
            </h2>
            <p className="mx-auto max-w-2xl text-blue-100 text-lg">
              ISO-accredited methodology and teams that understand regulated,
              high-stakes environments. Partner with JPCann to build lasting
              organisational capability.
            </p>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
