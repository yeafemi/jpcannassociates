import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Award } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import isoImg from "@/assets/iso-certification.jpg";

export const Route = createFileRoute("/iso")({
  component: IsoPage,
  head: () => ({
    meta: [
      { title: "ISO Accreditation — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "JPCann Associates is ISO 9001 (Quality Management) and ISO 27001 (Information Security) accredited — our commitment to standards, documented.",
      },
      {
        property: "og:title",
        content: "ISO Accreditation — JPCann Associates",
      },
      {
        property: "og:description",
        content: "ISO 9001 & ISO 27001 accredited professional services firm.",
      },
      { property: "og:image", content: isoImg },
      { name: "twitter:image", content: isoImg },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function IsoPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Accreditation"
        title="Standards that our clients can rely on."
        description="We don't just advise on quality and information security — we live it. Our ISO accreditations are independently audited, continuously maintained and foundational to how we serve clients."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <Reveal
          className="mb-12 overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-elegant)]"
          variant="scale"
        >
          <img
            src={isoImg}
            alt="JPCann Associates ISO certification document with gold seal"
            loading="lazy"
            width={1600}
            height={1024}
            className="h-72 w-full object-cover md:h-96"
          />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Award,
              tag: "ISO 9001",
              title: "Quality Management System",
              desc: "Documented processes, measured outcomes and continual improvement across every client engagement.",
            },
            {
              icon: ShieldCheck,
              tag: "ISO 27001",
              title: "Information Security Management",
              desc: "Rigorous controls protecting client data — policy, people, process and technology aligned to the international standard.",
            },
          ].map((c) => (
            <Reveal
              key={c.tag}
              className="interactive-lift rounded-2xl border border-border bg-card p-10 shadow-[var(--shadow-soft)]"
              variant="up"
            >
              <div
                className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                <c.icon size={26} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {c.tag}
              </p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                {c.title}
              </h2>
              <p className="mt-4 text-muted-foreground">{c.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
