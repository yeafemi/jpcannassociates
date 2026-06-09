import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, ArrowRight } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import skylineImg from "@/assets/contact-skyline.jpg";

const FORMSPREE_KEY = "https://formspree.io/f/mnjjqwdp";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "Get in touch with JPCann Associates for advisory, BPO or training enquiries. Based in Accra, serving West Africa.",
      },
      { property: "og:title", content: "Contact — JPCann Associates" },
      {
        property: "og:description",
        content: "Reach our team in Accra for advisory, BPO or training.",
      },
      { property: "og:image", content: skylineImg },
      { name: "twitter:image", content: skylineImg },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: pageData } = useQuery({
    queryKey: ["site_page", "contact"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_pages")
        .select("*")
        .eq("page_key", "contact")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: dbOffices } = useQuery({
    queryKey: ["site_collections", "office_locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_collections")
        .select("title, subtitle, description, image_url, metadata")
        .eq("collection_key", "office_locations")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const staticOffices = [
    {
      city: "Ghana Office",
      name: "JPCann Associates Ltd",
      address: "58 Nsawam Road, Kokomlemle, Accra.",
      phone: "+233 302 242 573",
      email: "info@jpcannassociates.com",
      flag: "🇬🇭",
    },
    {
      city: "London Office",
      name: "JPCann Associates (UK) Ltd",
      address: "167-169 Great Portland Street, 5th Floor, London, W1W 5PF.",
      phone: "+44 7404 380942",
      email: "info@jpcannassociates.com",
      flag: "🇬🇧",
    },
    {
      city: "USA Office",
      name: "Jpcannassociates LLC",
      address: "5000 Thayer center, Suite C, Oakland, MD 21550.",
      phone: "+1 202 500 7879",
      email: "info@jpcannassociates.com",
      flag: "🇺🇸",
    },
  ];

  const offices = dbOffices?.length
    ? dbOffices.map((o) => ({
        city: o.title,
        name: o.subtitle || "",
        address: o.description || "",
        phone: (o.metadata as any)?.phone || "",
        email: (o.metadata as any)?.email || "info@jpcannassociates.com",
        flag: (o.metadata as any)?.flag || "📍",
      }))
    : staticOffices;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const full_name = data.get("name") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const organisation = (data.get("organisation") as string) || null;
    const subject = data.get("subject") as string;
    const message = data.get("message") as string;

    try {
      // 1. Send to Formspree (delivers email to jpcannassociatesltd@gmail.com)
      const formspreeRes = await fetch(FORMSPREE_KEY, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!formspreeRes.ok) throw new Error("Formspree error");

      // 2. Save to Supabase for admin records
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert({ full_name, email, organisation, subject, message });
      if (dbError) console.warn("DB save failed (non-blocking):", dbError);

      setSent(true);
      toast.success("Message sent successfully!");
    } catch {
      toast.error(
        "Something went wrong. Please try again or email us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow={pageData?.hero_eyebrow || "Contact"}
        title={pageData?.hero_title || "Let's start a conversation."}
        description={
          pageData?.hero_description ||
          "Tell us about your challenge or opportunity. A partner will respond within one business day."
        }
      />
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <Reveal
          className="mb-12 overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-elegant)]"
          variant="scale"
        >
          <img
            src={skylineImg}
            alt="Accra skyline at golden hour"
            loading="lazy"
            width={1600}
            height={1024}
            className="h-64 w-full object-cover md:h-80"
          />
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {offices.map((loc, i) => (
            <Reveal
              key={loc.city}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/40 hover:shadow-xl hover:-translate-y-1"
              variant="up"
              delay={String(Math.min(i, 4)) as any}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500">
                  {loc.flag}
                </span>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">
                  {loc.city}
                </p>
              </div>
              <h3 className="font-serif text-xl mb-4 group-hover:text-primary transition-colors">
                {loc.name}
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground flex-grow">
                <div className="flex gap-3">
                  <MapPin size={18} className="shrink-0 text-primary/60" />
                  <span>{loc.address}</span>
                </div>
                <div className="flex gap-3">
                  <Phone size={18} className="shrink-0 text-primary/60" />
                  <span>{loc.phone}</span>
                </div>
                <div className="flex gap-3">
                  <Mail size={18} className="shrink-0 text-primary/60" />
                  <span>{loc.email}</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-border/50">
                <a
                  href={`mailto:${loc.email}`}
                  className="text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-all flex items-center gap-2"
                >
                  Send Inquiry{" "}
                  <span className="translate-x-0 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 grid gap-16 md:grid-cols-5 items-start">
          <div className="md:col-span-2 space-y-8">
            <Reveal variant="right">
              <h2 className="font-serif text-4xl mb-6">Send us a message</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Have a specific project in mind? Our partners are ready to
                discuss how we can support your organization's goals.
              </p>
            </Reveal>
            <Reveal
              variant="right"
              delay="1"
              className="p-8 rounded-2xl bg-secondary/40 border border-border backdrop-blur-sm"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-accent mb-3">
                Careers
              </p>
              <h3 className="text-xl font-serif mb-3">Looking for a career?</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Join our network of industry experts across the globe and help
                us transform businesses.
              </p>
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors group"
              >
                View open positions{" "}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Reveal>
          </div>

          <Reveal
            as="form"
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-border bg-card p-10 shadow-2xl md:col-span-3 relative overflow-hidden"
            variant="left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

            {sent ? (
              <div className="animate-fade-in py-20 text-center">
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner">
                  <Send size={32} />
                </div>
                <h2 className="font-serif text-3xl mb-3 text-foreground">
                  Message Sent.
                </h2>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Thank you for reaching out. A partner will be in touch with
                  you shortly via the email provided.
                </p>
                <Button
                  variant="outline"
                  className="mt-10 rounded-xl"
                  onClick={() => setSent(false)}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <>
                <input
                  type="hidden"
                  name="_subject"
                  value="New Website Enquiry — JPCann Associates"
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <Field
                    label="Full name"
                    name="name"
                    placeholder="John Doe"
                    required
                  />
                  <Field
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <Field
                    label="Phone number"
                    name="phone"
                    type="tel"
                    placeholder="+233 000 000 000"
                    required
                  />
                  <Field
                    label="Organisation"
                    name="organisation"
                    placeholder="Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Enquiry Subject
                  </label>
                  <select
                    name="subject"
                    required
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-primary/20 focus:ring-4 transition-all focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="">Select a subject…</option>
                    <option value="Advisory Services">Advisory Services</option>
                    <option value="Business Outsourcing">
                      Business Outsourcing
                    </option>
                    <option value="Capacity Building">Capacity Building</option>
                    <option value="ISO Certification">ISO Certification</option>
                    <option value="Other">Other Enquiry</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us about your requirements…"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-primary/20 focus:ring-4 transition-all focus:border-primary resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="interactive-lift w-full inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Sending
                      message…
                    </>
                  ) : (
                    <>
                      Send Message <Send size={16} />
                    </>
                  )}
                </button>
              </>
            )}
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-primary/20 focus:ring-4 transition-all focus:border-primary"
      />
    </div>
  );
}
