import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Clock,
  FileSearch,
  Calculator,
  Receipt,
  ClipboardCheck,
  FileBadge2,
  Mail,
  Phone,
  Globe2,
  Search,
  Database,
  Lock,
  TrendingUp,
  Layout,
} from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import operationsImg from "@/assets/services-operations.jpg";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/outsourcing")({
  component: OutsourcingPage,
  head: () => ({
    meta: [
      { title: "Business Process Outsourcing — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "Offload non-core processes to JPCann Associates. We handle HR, payroll, data management, tax, and auditing so you can focus on growth.",
      },
    ],
  }),
});

const bpoServices = [
  {
    title: "HR & Payroll Management",
    desc: "Accurate, tax-compliant payroll processing and employee record administration. We ensure on-time payment and statutory filings, every time.",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Data Management",
    desc: "Digitization of legacy records into searchable, secure digital assets that improve decision-making and regulatory compliance.",
    icon: Database,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Project Accounting & Audit Support",
    desc: "Dedicated accounting for time-bound projects: cost tracking, budget variance analysis, and preparation for external audits.",
    icon: Calculator,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "Outsourced Internal Auditing",
    desc: "Specialized IT, Cybersecurity, and Forensic audits to ensure system integrity, transaction tracing, and fraud detection.",
    icon: ShieldCheck,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    title: "Taxation Management",
    desc: "Preparation and filing of corporate tax, VAT, and withholding tax. We keep you compliant while identifying legitimate efficiencies.",
    icon: Receipt,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Monitoring & Evaluation (M&E)",
    desc: "Independent M&E for development projects and donor-funded programs. Designing frameworks and delivering verifiable results reports.",
    icon: ClipboardCheck,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "ISO Management Systems",
    desc: "Support for development, documentation, and maintenance of ISO standards (9001, 27001, etc.) to sustain compliance.",
    icon: FileBadge2,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
];

const whyOutsource = [
  {
    title: "Specialized expertise",
    desc: "Access trained professionals who already know the rules, tools, and risks without needing an in-house team for every function.",
    icon: Search,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Cost efficiency",
    desc: "Reduce overhead, training, and technology investments. Pay only for what you need, when you need it.",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Risk reduction",
    desc: "Our processes are designed to prevent expensive compliance failures, data breaches, and audit findings.",
    icon: ShieldCheck,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    title: "Confidentiality & Security",
    desc: "We operate under strict data protection protocols and NDAs tailored to your specific industry requirements.",
    icon: Lock,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "Scalable delivery",
    desc: "Whether you need monthly processing or a one-time project, we flex to your volume and timeline.",
    icon: Layout,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

function OutsourcingPage() {
  const { data: pageData } = useQuery({
    queryKey: ["site_page", "outsourcing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_pages")
        .select("*")
        .eq("page_key", "outsourcing")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow={pageData?.hero_eyebrow || "Business Process Outsourcing"}
        title={pageData?.hero_title || "Offload the Routine. Redefine Your Focus."}
        description={
          pageData?.hero_description ||
          "Your core business deserves your best attention—not endless paperwork or operational bottlenecks."
        }
      />

      {/* Introduction Section */}
      <section className="relative overflow-hidden py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <Reveal variant="right">
              <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl">
                Accuracy. Reliability. <br />
                <span className="text-primary italic">Peace of Mind.</span>
              </h2>
              <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  JPCann Associates takes ownership of your critical but non-core
                  processes, delivering accuracy, reliability, and peace of mind.
                </p>
                <p>
                  We combine process excellence, data security, and specialized
                  expertise to help you reduce costs, manage risks, and free
                  your leadership team to focus on growth.
                </p>
              </div>
            </Reveal>
            <Reveal variant="left" className="relative">
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-border shadow-2xl">
                <img
                  src={operationsImg}
                  alt="Streamlined Operations"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What We Handle Section */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-16 text-center" variant="up">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              What We Handle, So You Can Lead
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Embed specialized operational capability into your organization
              without the overhead of direct hiring.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bpoServices.map((s, i) => (
              <Reveal
                key={s.title}
                variant="up"
                delay={String(i * 0.1) as any}
                className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl"
              >
                <div className={cn(
                  "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all group-hover:scale-110",
                  s.bg,
                  s.color
                )}>
                  <s.icon size={28} />
                </div>
                <h3 className="font-serif text-xl mb-4 font-bold">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Outsource Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-16 text-center" variant="up">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              Why Outsource to JPCann?
            </h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {whyOutsource.map((item, i) => (
              <Reveal
                key={item.title}
                className="flex items-start gap-6 p-6"
                variant="up"
                delay={String(i * 0.1) as any}
              >
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110",
                  item.bg,
                  item.color
                )}>
                  <item.icon size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What Our Clients Experience */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <Reveal variant="right">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8">
                What Our Clients <span className="text-primary italic">Experience</span>
              </h2>
              <div className="grid gap-4">
                {[
                  "Fewer payroll errors and faster month-end close",
                  "Audit-ready financial and operational records",
                  "Lower cost compared to hiring full-time specialists",
                  "More leadership time for strategic decisions",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <CheckCircle2 className="text-primary" size={24} />
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal variant="left" className="bg-primary/10 rounded-3xl p-12 border border-primary/20">
              <h3 className="font-serif text-3xl mb-6">Ready to Offload with Confidence?</h3>
              <p className="text-slate-400 text-lg mb-10">
                Let’s discuss which processes you can hand over starting next month.
              </p>
              <div className="space-y-6">
                <a href="mailto:info@jpcannassociates.com" className="flex items-center gap-4 group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-primary border border-white/10 group-hover:border-primary/50 transition-colors">
                    <Mail size={20} />
                  </div>
                  <span className="text-lg font-medium group-hover:text-primary transition-colors">info@jpcannassociates.com</span>
                </a>
                <a href="tel:+233302242573" className="flex items-center gap-4 group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-primary border border-white/10 group-hover:border-primary/50 transition-colors">
                    <Phone size={20} />
                  </div>
                  <span className="text-lg font-medium group-hover:text-primary transition-colors">+233 302 242 573</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <Reveal
            className="rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden"
            variant="scale"
          >
            <div className="absolute top-0 right-0 h-full w-full opacity-10 pointer-events-none">
              <Zap className="absolute -top-10 -right-10 h-64 w-64 text-white" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 relative">
              Free BPO Assessment
            </h2>
            <p className="text-xl text-blue-100 mb-10 relative">
              We will review one process (e.g., payroll, data entry, or tax filing)
              and show you potential time and cost savings. No obligation.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-bold text-blue-600 shadow-lg transition-all hover:bg-slate-50 hover:scale-105 active:scale-95 relative"
            >
              Request Assessment <ArrowRight size={20} />
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
