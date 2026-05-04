import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  LineChart,
  Users,
  FileText,
  Zap,
  Globe2,
  Target,
  BarChart3,
  Search,
  PieChart,
  MapPin,
  Mail,
  Phone,
  LayoutDashboard,
  Coins,
  Scale,
  RefreshCw,
  ClipboardCheck,
  Activity,
  FileBadge2,
} from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import advisoryImg from "@/assets/hero-advisory.jpg";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/advisory")({
  component: AdvisoryPage,
  head: () => ({
    meta: [
      { title: "Business Advisory Services — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "End-to-end business advisory services that move beyond diagnostics to deliver measurable outcomes. Strategy, risk, ESG, capital raising, and more.",
      },
    ],
  }),
});

const whatWeSolve = [
  {
    id: "strategy",
    title: "Strategic Planning & Execution",
    desc: "From feasibility studies and market research to full business plans, we help you define where to play and how to win.",
    icon: LineChart,
  },
  {
    id: "performance",
    title: "Performance Management",
    desc: "We design Balanced Scorecards and KPIs that turn strategy into daily action, with clear accountability and measurable targets.",
    icon: LayoutDashboard,
  },
  {
    id: "erm",
    title: "Enterprise-Wide Risk Management",
    desc: "Identify, assess, and mitigate operational, financial, and strategic risks before they become crises.",
    icon: ShieldCheck,
  },
  {
    id: "sme",
    title: "SME Development",
    desc: "Practical, stage-appropriate support for small and medium enterprises: systems, governance, growth strategies, and operational resilience.",
    icon: Users,
  },
  {
    id: "financial",
    title: "Financial Management",
    desc: "Strengthen budgeting, treasury, cash flow forecasting, and financial controls to improve liquidity and profitability.",
    icon: BarChart3,
  },
  {
    id: "capital",
    title: "Capital Raising",
    desc: "Access to equity, debt, impact investing, and climate finance. We prepare investment-ready documentation, financial models, and investor pitch decks.",
    icon: Coins,
  },
  {
    id: "esg",
    title: "Sustainability & ESG",
    desc: "Develop ESG frameworks, materiality assessments, sustainability reporting (GRI, SASB), and transition roadmaps for responsible growth.",
    icon: Globe2,
  },
  {
    id: "change",
    title: "Change Management",
    desc: "Structured stakeholder engagement, communication plans, and adoption strategies to ensure transformation succeeds.",
    icon: RefreshCw,
  },
  {
    id: "sop",
    title: "Policy & SOP Design",
    desc: "Clear, implementable policies and Standard Operating Procedures that embed consistency, compliance, and operational excellence.",
    icon: FileText,
  },
  {
    id: "me",
    title: "Monitoring & Evaluation (M&E)",
    desc: "Independent M&E for development projects and donor-funded programs. We design frameworks, conduct data collection, and deliver verifiable results reports.",
    icon: ClipboardCheck,
  },
  {
    id: "iso",
    title: "ISO Management Systems",
    desc: "Development, documentation, and maintenance support for ISO standards (9001, 27001, 14001, 45001, etc.). Internal audits and certification preparation.",
    icon: FileBadge2,
  },
];

const whyJPCann = [
  {
    title: "Tailored, not templated",
    desc: "Every solution fits your unique context, culture, and ambition. We don't believe in one-size-fits-all.",
    icon: Target,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Outcome focused",
    desc: "We measure success by ROI, efficiency gains, risk reduction, and capital raised. Results matter most.",
    icon: Activity,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Collaborative partnership",
    desc: "We work alongside your team, building ownership and capability that lasts beyond our engagement.",
    icon: Users,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

function AdvisoryPage() {
  const { data: pageData } = useQuery({
    queryKey: ["site_page", "advisory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_pages")
        .select("*")
        .eq("page_key", "advisory")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow={pageData?.hero_eyebrow || "Business Advisory"}
        title={pageData?.hero_title || "Turn Complexity into Clarity."}
        description={
          pageData?.hero_description ||
          "In today’s uncertain and fast-moving environment, you need more than advice—you need a partner who can help you see around corners."
        }
      />

      {/* Introduction Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute top-0 right-0 -z-10 h-full w-1/3 bg-slate-50/50" />
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <Reveal variant="right">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-6">
                <Briefcase size={14} /> JPCann Advisory Division
              </div>
              <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl">
                Turn Strategy into <br />
                <span className="text-primary italic">Results.</span>
              </h2>
              <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  JPCann Associates provides end-to-end Business Advisory
                  services that move beyond diagnostics to deliver measurable
                  outcomes.
                </p>
                <p>
                  Whether you are launching a new venture, optimizing an
                  established enterprise, or positioning for sustainable growth,
                  we bring structured thinking, data-driven insights, and
                  hands-on support to every engagement.
                </p>
                <p className="font-medium text-foreground">
                  Partner with us to see around corners, make confident
                  decisions, and execute with precision.
                </p>
              </div>
            </Reveal>
            <Reveal variant="left" className="relative">
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-border shadow-2xl">
                <img
                  src={advisoryImg}
                  alt="Business Advisory Consultation"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 hidden h-64 w-64 rounded-full bg-accent/10 blur-3xl lg:block" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* What We Solve Section */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <Reveal className="mb-16 text-center" variant="up">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              What We Solve
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Comprehensive, implementation-focused solutions designed to
              transform your organizational performance.
            </p>
          </Reveal>
          <Reveal variant="up">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {whatWeSolve.map((service) => (
                <AccordionItem
                  key={service.id}
                  value={service.id}
                  className="rounded-2xl border border-border bg-card px-6 transition-all hover:border-primary/30 shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary shrink-0">
                        <service.icon size={20} />
                      </div>
                      <span className="font-serif text-lg md:text-xl font-medium">
                        {service.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pt-2">
                    <div className="pl-14">
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {service.desc}
                      </p>
                      <Link
                        to="/contact"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                      >
                        Enquire about this service <ArrowRight size={14} />
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* Why Choose JPCann Associates? */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-16 text-center" variant="up">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              Why JPCann Associates?
            </h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {whyJPCann.map((item, i) => (
              <Reveal
                key={item.title}
                className="group flex flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl"
                variant="up"
                delay={String(i) as any}
              >
                <div
                  className={cn(
                    "mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                    item.bg,
                    item.color,
                  )}
                >
                  <item.icon size={28} />
                </div>
                <h3 className="font-serif text-xl mb-4 text-foreground font-bold">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Link Section */}
      <section className="bg-primary py-20 text-white overflow-hidden relative">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6 relative z-10">
          <Reveal variant="scale">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Our Portfolio</h2>
            <p className="text-xl text-primary-foreground/90 mb-10">
              The testament to what we have done in the past is curated in our
              Project Portfolio.
            </p>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-bold text-primary shadow-lg transition-all hover:bg-slate-50 hover:scale-105"
            >
              View Advisory Portfolio <ArrowRight size={20} />
            </Link>
          </Reveal>
        </div>
        <div className="absolute top-0 right-0 h-full w-full opacity-10 pointer-events-none">
          <Briefcase className="absolute -bottom-20 -right-20 h-96 w-96 text-white" />
        </div>
      </section>

      {/* Ready to Move Forward? Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="grid gap-16 lg:grid-cols-2">
            <Reveal variant="right">
              <h2 className="font-serif text-3xl md:text-5xl mb-8">
                Ready to Move <span className="text-primary italic">Forward?</span>
              </h2>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                Let’s talk about your next strategic move. Whether you need a
                business plan for a new venture, a Balanced Scorecard to align
                your leadership team, or a capital raising strategy for
                climate-focused growth—JPCann Associates is ready to help.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-primary border border-white/10">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Email us</p>
                    <a href="mailto:info@jpcannassociates.com" className="text-lg font-medium hover:text-primary transition-colors">info@jpcannassociates.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-primary border border-white/10">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Call us</p>
                    <a href="tel:+233302242573" className="text-lg font-medium hover:text-primary transition-colors">+233 302 242 573</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-primary border border-white/10">
                    <Globe2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Visit our website</p>
                    <a href="https://www.jpcannassociates.com" target="_blank" className="text-lg font-medium hover:text-primary transition-colors">www.jpcannassociates.com</a>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal variant="scale" className="flex flex-col items-center justify-center rounded-3xl bg-white/5 border border-white/10 p-10 backdrop-blur-sm text-center">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary border-4 border-primary/20">
                <Zap size={32} />
              </div>
              <h3 className="font-serif text-2xl mb-6">Book a Free Discovery Call</h3>
              <p className="text-slate-400 mb-10">
                Book a free 30-minute discovery call to discuss your challenge
                and explore how we can help.
              </p>
              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                Schedule Now <ArrowRight size={20} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
