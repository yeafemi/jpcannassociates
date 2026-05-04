import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  HeartHandshake,
  Cpu,
  Bot,
  Monitor,
  ShieldCheck,
  Search,
  Landmark,
  Shield,
  Calculator,
  FileBadge,
  Truck,
  ArrowRight,
  GraduationCap,
  Globe,
  Home,
  Laptop,
  Layers,
  Video,
  BookOpen,
  CheckCircle2,
  Mail,
  Phone,
  Zap,
  Target,
} from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/corporate-training")({
  component: CorporateTrainingPage,
  head: () => ({
    meta: [
      { title: "Corporate Training & Capacity Development — JPCann Associates Limited" },
      {
        name: "description",
        content: "Build skills that build your future. Practical, outcome-driven learning across Leadership, AI, GRC, ISO, and more.",
      },
    ],
  }),
});

const thematicAreas = [
  {
    category: "Leadership & Management",
    topics: "Strategic leadership, team development, emotional intelligence, delegation, and conflict resolution",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    category: "Human Resource Management",
    topics: "Talent acquisition, performance management, employee relations, HR analytics, and labour law compliance",
    icon: HeartHandshake,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    category: "ICT",
    topics: "IT essentials, systems administration, network fundamentals, and ICT policy development",
    icon: Cpu,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    category: "Artificial Intelligence & Data Analytics",
    topics: "Introduction to AI, prompt engineering, data visualization, business intelligence (Power BI, Tableau), and analytics",
    icon: Bot,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    category: "Digital Skills",
    topics: "Digital literacy, collaboration tools (Teams, Zoom, Slack), cloud productivity, and social media for business",
    icon: Monitor,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    category: "Governance, Risk & Compliance (GRC)",
    topics: "Corporate governance frameworks, enterprise risk management, compliance program design, and internal audit practices",
    icon: ShieldCheck,
    color: "text-slate-600",
    bg: "bg-slate-100",
  },
  {
    category: "Internal Auditing",
    topics: "Risk based auditing, audit evidence and documentation, audit reporting, and follow up processes",
    icon: Search,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    category: "Banking & Financial Services",
    topics: "Credit analysis, lending operations, treasury management, customer service in banking, and regulatory compliance",
    icon: Landmark,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    category: "Insurance & Pensions",
    topics: "Underwriting principles, claims management, actuarial fundamentals, pension fund administration, and industry regulations",
    icon: Shield,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    category: "Accounting & Finance",
    topics: "Financial reporting, management accounting, budgeting and forecasting, treasury management, and IFRS updates",
    icon: Calculator,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    category: "ISO Personnel Certification",
    topics: "Lead auditor and internal auditor courses for ISO 9001, 27001, 14001, 45001, and 22000",
    icon: FileBadge,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    category: "Logistics & Supply Chain Management",
    topics: "Procurement, inventory control, warehouse management, transportation logistics, and supply chain optimization",
    icon: Truck,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
];

const whyJPCann = [
  {
    title: "Practitioner led facilitation",
    desc: "Your trainers have done what they teach, not just read about it. Real-world insights, not just theory.",
    icon: GraduationCap,
  },
  {
    title: "Outcome focused design",
    desc: "Every course includes clear learning objectives, practical tools, and post-training reinforcement options.",
    icon: Target,
  },
  {
    title: "Flexible formats",
    desc: "Mix and match access and delivery to fit your budget, schedules, and team locations.",
    icon: Layers,
  },
  {
    title: "Certification recognized",
    desc: "Our certificates reflect verifiable learning. ISO personnel certifications meet global scheme requirements.",
    icon: FileBadge,
  },
  {
    title: "Post training support",
    desc: "Optional follow up coaching, refresher modules, and impact assessments to ensure learning transfers.",
    icon: HeartHandshake,
  },
];

function CorporateTrainingPage() {
  const { data: pageData } = useQuery({
    queryKey: ["site_page", "corporate-training"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_pages")
        .select("*")
        .eq("page_key", "corporate-training")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow={pageData?.hero_eyebrow || "Corporate Training"}
        title={pageData?.hero_title || "Build Skills That Build Your Future."}
        description={
          pageData?.hero_description ||
          "Practical, outcome-driven learning that transforms how your people think, work, and lead."
        }
      />

      {/* Intro Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <Reveal variant="up">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-8">
              Capability, <span className="text-primary italic">Not Just Content.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We don't just deliver training. We build capability—tailored to your
              context, delivered through your preferred method, and designed to
              produce measurable performance improvement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Thematic Areas Section */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-16 text-center" variant="up">
            <h2 className="font-serif text-3xl md:text-5xl mb-6">Thematic Areas We Cover</h2>
            <p className="text-lg text-muted-foreground">Curated learning across a wide range of disciplines, delivered by subject matter practitioners.</p>
          </Reveal>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {thematicAreas.map((area, i) => (
              <Reveal
                key={area.category}
                variant="up"
                delay={String(i * 0.05) as any}
                className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl"
              >
                <div className={cn(
                  "mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                  area.bg,
                  area.color
                )}>
                  <area.icon size={28} />
                </div>
                <h3 className="font-serif text-xl mb-4 font-bold text-foreground">{area.category}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {area.topics}
                </p>
              </Reveal>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Reveal variant="scale">
              <Link
                to="/trainings"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-primary/90 hover:translate-x-2"
              >
                Browse Our Public Course Calendar <ArrowRight size={20} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Access & Delivery Section */}
      <section className="py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Access Options */}
            <Reveal variant="right">
              <h2 className="font-serif text-3xl md:text-4xl mb-10 flex items-center gap-4">
                <Globe className="text-primary" size={32} /> Access Options
              </h2>
              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-white p-8 shadow-sm transition-all hover:shadow-md">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <Users className="text-accent" size={24} /> Open to Public
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Join scheduled courses with participants from multiple organizations. 
                    Options available in your country and internationally (e.g., Dubai, London, Accra).
                  </p>
                </div>
                <div className="rounded-3xl border border-border bg-white p-8 shadow-sm transition-all hover:shadow-md">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <Home className="text-accent" size={24} /> In-House & Customized
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Exclusive training designed around your organization's specific strategy, 
                    processes, and challenges. Delivered on your premises or our venue.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Delivery Methods */}
            <Reveal variant="left">
              <h2 className="font-serif text-3xl md:text-4xl mb-10 flex items-center gap-4">
                <Video className="text-primary" size={32} /> Delivery Methods
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "In-Person", icon: Users, desc: "Live interaction and group exercises." },
                  { title: "Virtual Live", icon: Video, desc: "Instructor-led real-time sessions." },
                  { title: "Blended", icon: Laptop, desc: "Self-paced + live workshops." },
                  { title: "Self-Paced", icon: BookOpen, desc: "Learn anytime, anywhere." },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-border bg-slate-50 p-6 transition-all hover:bg-white hover:shadow-lg group">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white group-hover:bg-primary/10 text-primary transition-colors">
                      <item.icon size={20} />
                    </div>
                    <h5 className="font-bold mb-2">{item.title}</h5>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-3xl bg-slate-900 p-8 text-white">
                <h4 className="text-xl font-bold mb-4">Why This Matters</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We meet you where you are—in every sense. Our flexible delivery models 
                  ensure that geography and schedule are never barriers to capability building.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why Choose JPCann for Training? */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-16 text-center" variant="up">
            <h2 className="font-serif text-3xl md:text-5xl mb-6">Why JPCann for Training?</h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
            {whyJPCann.map((item, i) => (
              <Reveal
                key={item.title}
                variant="up"
                delay={String(i * 0.1) as any}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary shadow-sm transition-all group-hover:bg-primary group-hover:text-white group-hover:-translate-y-2">
                  <item.icon size={32} />
                </div>
                <h4 className="font-bold mb-3 text-foreground leading-tight">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who Benefits Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal variant="right">
              <h2 className="font-serif text-3xl md:text-4xl mb-8">Who Benefits</h2>
              <div className="grid gap-4">
                {[
                  "Individuals seeking career advancement and verifiable skills",
                  "HR & Learning Managers needing reliable, flexible training partners",
                  "Compliance & Risk Officers requiring ISO certification or upskilling",
                  "Financial Services Leaders wanting regulator-aligned knowledge",
                  "Any organization facing a capability gap that cannot wait",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-white shadow-sm">
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal variant="left" className="relative">
              <div className="aspect-4/5 rounded-3xl bg-slate-900 p-12 text-white flex flex-col justify-center overflow-hidden">
                <div className="absolute top-0 right-0 h-64 w-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="font-serif text-3xl md:text-4xl mb-8 relative">Ready to Close Your <br /><span className="text-primary italic">Skills Gap?</span></h3>
                <div className="space-y-6 relative">
                  <a href="mailto:info@jpcannassociates.com" className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary transition-colors">
                      <Mail size={20} />
                    </div>
                    <span className="text-lg font-medium group-hover:text-primary transition-colors">info@jpcannassociates.com</span>
                  </a>
                  <a href="tel:+233302242573" className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary transition-colors">
                      <Phone size={20} />
                    </div>
                    <span className="text-lg font-medium group-hover:text-primary transition-colors">+233 302 242 573</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <Reveal
            className="rounded-3xl bg-primary p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden"
            variant="scale"
          >
            <div className="absolute top-0 right-0 h-full w-full opacity-20 pointer-events-none">
              <Zap className="absolute -top-10 -right-10 h-64 w-64 text-white" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 relative">
              Design Your Next Learning Intervention
            </h2>
            <div className="grid gap-6 md:grid-cols-2 relative">
              <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm text-left border border-white/20">
                <h4 className="text-xl font-bold mb-4">Training Needs Assessment</h4>
                <p className="text-blue-100 mb-8 text-sm leading-relaxed">
                  Identify priority skill gaps and recommend the most cost-effective mix (public, in-house, virtual).
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-white font-bold hover:underline"
                >
                  Request Assessment <ArrowRight size={16} />
                </Link>
              </div>
              <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm text-left border border-white/20">
                <h4 className="text-xl font-bold mb-4">Public Course Calendar</h4>
                <p className="text-blue-100 mb-8 text-sm leading-relaxed">
                  Ask for the latest schedule of local and international open enrolment programs.
                </p>
                <Link
                  to="/trainings"
                  className="inline-flex items-center gap-2 text-white font-bold hover:underline"
                >
                  View Schedule <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
