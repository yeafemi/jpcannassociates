import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Users,
  CheckCircle2,
  Layers,
  Quote,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { Reveal } from "@/components/Reveal";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import aboutLeadership from "@/assets/about-leadership.jpg";
import accIia from "@/assets/accreditations/iia.jpg";
import accOsh from "@/assets/accreditations/osh.jpg";
import accPecb from "@/assets/accreditations/pecb.jpg";
import accCima from "@/assets/accreditations/cima.jpg";
import accCmi from "@/assets/accreditations/cmi.jpg";
import accCpd from "@/assets/accreditations/cpd.jpg";
import accIfc from "@/assets/accreditations/ifc.jpg";
import accIso from "@/assets/accreditations/iso.jpg";
import clientGra from "@/assets/clients/gra.png";
import clientDvla from "@/assets/clients/dvla.jpg";
import clientVra from "@/assets/clients/vra.jpg";
import clientAsanko from "@/assets/clients/asanko.jpg";
import clientGsa from "@/assets/clients/gsa.jpg";
import clientPetrosol from "@/assets/clients/petrosol.png";
import clientBpa from "@/assets/clients/bpa.png";
import clientPru from "@/assets/clients/pru.png";
import clientAeci from "@/assets/clients/aeci.png";
import clientEc from "@/assets/clients/ec.png";
import clientRikair from "@/assets/clients/rikair.png";
import clientSic from "@/assets/clients/sic.jfif";
import clientLmi from "@/assets/clients/lmi.png";
import clientPacific from "@/assets/clients/pacific.png";
import clientTf from "@/assets/clients/tf.jpg";
import clientBog from "@/assets/clients/bog.png";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const accreditations = [
  { src: accIia, alt: "The Institute of Internal Auditors" },
  { src: accOsh, alt: "OSHAcademy — Occupational Safety & Health Training" },
  { src: accPecb, alt: "PECB" },
  { src: accCima, alt: "Chartered Institute of Management Accountants (CIMA)" },
  { src: accCmi, alt: "Chartered Management Institute (CMI)" },
  { src: accCpd, alt: "The CPD Group — Accredited Provider" },
  { src: accIfc, alt: "Institute of Financial Consultants" },
  { src: accIso, alt: "ISO 9001:2015 Certified" },
];

const clientele = [
  { src: clientGra, alt: "Ghana Revenue Authority (GRA)" },
  { src: clientDvla, alt: "DVLA Ghana" },
  { src: clientVra, alt: "Volta River Authority (VRA)" },
  { src: clientAsanko, alt: "Asanko Gold Ghana" },
  { src: clientGsa, alt: "Ghana Shippers Authority" },
  { src: clientPetrosol, alt: "Petrosol Ghana" },
  { src: clientBpa, alt: "Bui Power Authority" },
  { src: clientPru, alt: "Prudential Life Insurance" },
  { src: clientAeci, alt: "AECI Mining" },
  { src: clientEc, alt: "Electoral Commission of Ghana" },
  { src: clientRikair, alt: "Rikair Company Limited" },
  { src: clientSic, alt: "SIC Insurance PLC" },
  { src: clientLmi, alt: "LMI Holdings" },
  { src: clientPacific, alt: "Pacific Savings & Loans" },
  { src: clientTf, alt: "TF Financial Services" },
  { src: clientBog, alt: "Bank of Ghana (BoG)" },
];

export const Route = createFileRoute("/")({
  component: Index,
    links: [
      {
        rel: "canonical",
        href: "https://yeafemi.github.io/jpcannassociates/",
      },
    ],
    meta: [
      {
        title:
          "JPCann Associates Limited | Business Advisory, BPO & ISO Training Ghana",
      },
      {
        name: "description",
        content:
          "ISO 9001/27001 accredited business advisory, process outsourcing (BPO), and corporate training in Ghana. Experts in GRC, ESG, internal audit, and capacity building.",
      },
      { property: "og:title", content: "JPCann Associates Limited" },
      {
        property: "og:description",
        content:
          "Accredited business advisory, BPO and professional training for organisations that demand excellence.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://yeafemi.github.io/jpcannassociates/",
      },
      { property: "og:site_name", content: "JPCann Associates Limited" },
      { property: "og:image", content: heroSlide1 },
      { name: "twitter:image", content: heroSlide1 },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@jpcannassociates" },
      {
        name: "keywords",
        content:
          "business advisory ghana, bpo ghana, iso training ghana, corporate training, internal audit outsourcing, esg consulting, grc services",
      },
    ],
});

const services = [
  {
    icon: Briefcase,
    title: "Business Advisory",
    to: "/advisory",
    desc: "Strategic clarity. Practical execution. From business plans and performance management to ESG and capital raising, we help you solve complex challenges and seize opportunities with confidence.",
  },
  {
    icon: Users,
    title: "Business Process Outsourcing",
    to: "/outsourcing",
    desc: "Offload the routine. Redefine your focus. We handle HR, payroll, data management, taxation, internal audits, M&E, and ISO systems—so you can focus on growth.",
  },
  {
    icon: GraduationCap,
    title: "Corporate Training & Capacity Development",
    to: "/trainings",
    desc: "Build skills that build your future. Leadership, AI, digital skills, GRC, ISO certification, finance, and more. Delivered in-person, virtually, blended, or self-paced. Open enrollment or in-house.",
  },
];

const stats = [
  { value: "15+", label: "Years of practice" },
  { value: "ISO", label: "9001 & 27001 accredited" },
  { value: "120+", label: "Engagements delivered" },
  { value: "30+", label: "Industries served" },
];

function Index() {
  const [api, setApi] = React.useState<any>();
  const [clientApi, setClientApi] = React.useState<any>();
  const [testimonialApi, setTestimonialApi] = React.useState<any>();

  const { data: pageData } = useQuery({
    queryKey: ["site_page", "index"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_pages")
        .select("*")
        .eq("page_key", "index")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: dbStats } = useQuery({
    queryKey: ["site_collections", "homepage_stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_collections")
        .select("title, subtitle")
        .eq("collection_key", "homepage_stats")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: dbAccreditations } = useQuery({
    queryKey: ["site_collections", "accreditations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_collections")
        .select("title, image_url")
        .eq("collection_key", "accreditations")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: dbClientele } = useQuery({
    queryKey: ["site_collections", "clientele"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_collections")
        .select("title, image_url")
        .eq("collection_key", "clientele")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: dbTestimonials } = useQuery({
    queryKey: ["site_collections", "testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_collections")
        .select("title, subtitle, description")
        .eq("collection_key", "testimonials")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const displayStats = dbStats?.length
    ? dbStats.map((s) => ({ value: s.title, label: s.subtitle }))
    : stats;

  const displayAccreditations = dbAccreditations?.length
    ? dbAccreditations.map((a) => ({ src: a.image_url, alt: a.title }))
    : accreditations;

  const displayClientele = dbClientele?.length
    ? dbClientele.map((c) => ({ src: c.image_url, alt: c.title }))
    : clientele;

  React.useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [api]);

  React.useEffect(() => {
    if (!clientApi) return;

    const intervalId = setInterval(() => {
      clientApi.scrollNext();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [clientApi]);

  React.useEffect(() => {
    if (!testimonialApi) return;

    const intervalId = setInterval(() => {
      testimonialApi.scrollNext();
    }, 6000);

    return () => clearInterval(intervalId);
  }, [testimonialApi]);

  return (
    <SiteLayout>
      <HeroSlideshow
        title={pageData?.hero_title || undefined}
        description={pageData?.hero_description || undefined}
        eyebrow={pageData?.hero_eyebrow || undefined}
      />

      <div className="relative">
        {/* Global Homepage Background Gradient */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.12] [background:radial-gradient(1200px_circle_at_0%_0%,var(--primary),transparent_80%),radial-gradient(1000px_circle_at_100%_40%,var(--primary-glow),transparent_80%),radial-gradient(1200px_circle_at_0%_80%,var(--primary),transparent_80%),radial-gradient(1000px_circle_at_100%_100%,var(--primary-glow),transparent_80%)]" />
          <div className="absolute inset-0 bg-linear-to-b from-blue-50/30 via-transparent to-blue-50/20" />
        </div>

        <div className="relative z-10">
          {/* Stats */}
          <section className="border-b border-border bg-white/40 backdrop-blur-xs">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4 md:px-6">
              {displayStats.map((s) => (
                <Reveal
                  key={s.label || s.value}
                  className="text-center md:text-left"
                  variant="up"
                >
                  <div className="font-serif text-3xl text-primary md:text-4xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {s.label}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="relative overflow-hidden py-16 md:py-20">
            <div className="relative mx-auto max-w-7xl px-4 md:px-6">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  What we do
                </p>
                <h2 className="mt-4 font-serif text-4xl font-bold text-foreground md:text-5xl">
                  Our Services – At a Glance
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
                  Tailored consulting, outsourcing, and training solutions
                  designed to solve real problems and build lasting capability.
                </p>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {services.map((s) => (
                  <Reveal
                    key={s.title}
                    data-magnetic="true"
                    className="interactive-lift group relative rounded-xl border border-border bg-white/70 backdrop-blur-sm p-8 hover:shadow-[var(--shadow-elegant)]"
                    variant="up"
                  >
                    <div
                      className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg text-primary-foreground"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <s.icon size={22} />
                    </div>
                    <h3 className="font-serif text-xl text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {s.desc}
                    </p>
                    <Link
                      to={s.to}
                      className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors group-hover:text-accent"
                    >
                      Learn More <ArrowRight size={14} />
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Our Approach Section */}
          <section className="relative overflow-hidden py-16 md:py-20 bg-slate-50/50">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
              <Reveal variant="right">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                  <Layers size={24} />
                </div>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                  Our Approach: <br />
                  <span className="text-primary italic">
                    Collaborative Transformation
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  We don't deliver generic advice. We partner with you to
                  co-create solutions that stick. Our structured 5-phase
                  methodology ensures transparency, accountability, and
                  measurable results from start to finish.
                </p>
                <Link
                  to="/approach"
                  className="group inline-flex items-center gap-2 text-sm font-bold text-primary transition-all hover:translate-x-1"
                >
                  Learn more about our methodology{" "}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>

              <Reveal variant="left" className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Phase 1", title: "Discovery" },
                    { label: "Phase 2", title: "Diagnosis" },
                    { label: "Phase 3", title: "Strategy" },
                    { label: "Phase 4", title: "Implementation" },
                  ].map((p, i) => (
                    <div
                      key={p.title}
                      className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">
                        {p.label}
                      </p>
                      <h4 className="font-serif text-lg font-medium">
                        {p.title}
                      </h4>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                    Phase 5
                  </p>
                  <h4 className="font-serif text-xl font-bold text-primary">
                    Closure & Evaluation
                  </h4>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Testimonials */}
          {dbTestimonials && dbTestimonials.length > 0 && (
            <section className="relative overflow-hidden py-28 md:py-32">
              {/* Vibrant Background Elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-400/20 blur-[120px]" />
                <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-pink-400/15 blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/3 h-[300px] w-[300px] rounded-full bg-indigo-400/20 blur-[80px]" />
              </div>

              <div className="relative mx-auto max-w-7xl px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center mb-20">
                  <Reveal variant="up">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-primary/20 backdrop-blur-sm">
                      Trusted by Leaders
                    </span>
                    <h2 className="font-serif text-4xl font-bold text-foreground md:text-6xl tracking-tight leading-tight">
                      What Our <span className="text-primary italic">Clients</span> Say
                    </h2>
                    <div className="mt-6 mx-auto h-1 w-20 bg-linear-to-r from-primary to-accent rounded-full" />
                  </Reveal>
                </div>

                <Carousel
                  setApi={setTestimonialApi}
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-6">
                    {dbTestimonials.map((t, i) => (
                      <CarouselItem
                        key={i}
                        className="pl-6 basis-full md:basis-1/2 lg:basis-1/3"
                      >
                        <Reveal
                          variant="up"
                          delay={i * 0.1}
                          className="group h-full"
                        >
                          <div className="relative h-full flex flex-col rounded-3xl border border-white/40 bg-white/40 backdrop-blur-md p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-500 hover:bg-white/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden">
                            {/* Decorative Quote Icon Background */}
                            <Quote 
                              className="absolute -top-4 -right-4 text-primary/5 transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12" 
                              size={120} 
                            />
                            
                            <div className="relative z-10 flex-1">
                              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-linear-to-br from-primary/10 to-accent/10 border border-primary/20 mb-8">
                                <Quote className="text-primary" size={24} />
                              </div>
                              
                              <p className="font-serif text-xl italic leading-relaxed text-foreground/90 font-medium">
                                "{t.title}"
                              </p>
                            </div>
                            
                            <div className="relative z-10 mt-10 pt-8 border-t border-slate-200/60 flex items-center gap-4">
                              <div>
                                <p className="font-bold text-foreground text-lg tracking-tight">
                                  {t.subtitle}
                                </p>
                                <p className="text-xs font-semibold text-primary/70 uppercase tracking-widest mt-0.5">
                                  {t.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Reveal>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </section>
          )}

          {/* Why us */}
          <section className="py-20 md:py-24">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
              <div className="relative overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)]">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070"
                  alt="Professional team leader standing in a modern boardroom with a diverse corporate team collaborating in the background"
                  loading="lazy"
                  width={1600}
                  height={1024}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Why JPCann
                </p>
                <h2 className="mt-3 font-serif text-3xl text-foreground md:text-5xl">
                  Accredited rigor, local insight.
                </h2>
                <p className="mt-5 text-muted-foreground">
                  Our clients include financial institutions, public agencies
                  and multinationals operating across West Africa. They choose
                  us because we combine international standards with a deep
                  understanding of the Ghanaian business environment.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "ISO 9001 Quality Management certified",
                    "ISO 27001 Information Security certified",
                    "Senior-led teams on every engagement",
                    "Dedicated client success partners",
                    "Transparent fixed-fee and retainer models",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-lg border border-border bg-white/60 backdrop-blur-sm p-4"
                    >
                      <CheckCircle2
                        className="mt-0.5 shrink-0 text-accent"
                        size={20}
                      />
                      <span className="text-sm text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Accreditations */}
          <section className="border-y border-border py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <div className="mx-auto max-w-2xl text-center mb-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Accreditations & Affiliations
                </p>
              </div>
              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {displayAccreditations.map((a, i) => (
                    <CarouselItem
                      key={i}
                      className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                    >
                      <div className="flex h-20 items-center justify-center rounded-xl border border-border bg-white/80 backdrop-blur-xs p-4 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
                        <img
                          src={a.src || ""}
                          alt={a.alt || ""}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain transition-all duration-300"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
            <div
              className="relative overflow-hidden rounded-2xl p-10 text-primary-foreground md:p-16"
              style={{ background: "var(--gradient-hero)" }}
            >
              <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_80%_20%,var(--accent),transparent_50%)]" />
              <div className="relative max-w-2xl">
                <h2 className="font-serif text-3xl md:text-4xl">
                  Ready to work with a team that takes standards seriously?
                </h2>
                <p className="mt-4 text-primary-foreground/85">
                  Tell us about your goals — we'll propose a focused engagement
                  with clear outcomes.
                </p>
                <Link
                  to="/contact"
                  data-magnetic="true"
                  className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-lg transition-all"
                >
                  Start a conversation <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          {/* Clientele */}
          <section className="border-t border-border py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <div className="mx-auto max-w-2xl text-center mb-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Our Esteemed Clients
                </p>
              </div>
              <Carousel
                setApi={setClientApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {displayClientele.map((c, i) => (
                    <CarouselItem
                      key={i}
                      className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                    >
                      <div className="flex h-28 items-center justify-center rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-accent/40 hover:shadow-md hover:-translate-y-1">
                        <img
                          src={c.src || ""}
                          alt={c.alt || ""}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain transition-all duration-500"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
