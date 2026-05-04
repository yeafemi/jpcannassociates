import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, ArrowRight } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import careersImg from "@/assets/careers-team.jpg";

export const Route = createFileRoute("/careers")({
  component: CareersPage,
  head: () => ({
    meta: [
      { title: "Careers — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "Join JPCann Associates. Current openings in IT, accounts and front-desk operations.",
      },
      { property: "og:title", content: "Careers — JPCann Associates" },
      {
        property: "og:description",
        content: "Current openings across IT, accounts and front-desk.",
      },
      { property: "og:image", content: careersImg },
      { name: "twitter:image", content: careersImg },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const jobs = [
  {
    title: "IT Support Officer",
    type: "Full-time · Accra",
    desc: "Provide first- and second-line support, maintain infrastructure, and contribute to client IT BPO engagements.",
  },
  {
    title: "Accounts Officer",
    type: "Full-time · Accra",
    desc: "Handle day-to-day bookkeeping, reconciliations and reporting for internal and outsourced accounts.",
  },
  {
    title: "Front Desk Executive",
    type: "Full-time · Accra",
    desc: "Be the face of JPCann — manage reception, client coordination and administrative support.",
  },
];

function CareersPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Careers"
        title="Build your career with a firm that raises the standard."
        description="We invest in our people through continuous training, ISO-backed processes and exposure to meaningful, multi-industry work."
      />
      <section className="mx-auto max-w-5xl px-4 py-20 md:px-6">
        <Reveal
          className="mb-12 overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-elegant)]"
          variant="scale"
        >
          <img
            src={careersImg}
            alt="JPCann Associates team members collaborating in the office"
            loading="lazy"
            width={1600}
            height={1024}
            className="h-72 w-full object-cover md:h-96"
          />
        </Reveal>
        <Reveal
          as="h2"
          className="font-serif text-2xl text-foreground md:text-3xl"
          variant="up"
        >
          Open positions
        </Reveal>
        <div className="mt-8 space-y-4">
          {jobs.map((j) => (
            <Reveal
              key={j.title}
              className="interactive-lift flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8"
              variant="up"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground md:text-xl">
                    {j.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-accent">
                    {j.type}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{j.desc}</p>
                </div>
              </div>
              <Link
                to="/contact"
                className="interactive-lift inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Apply <ArrowRight size={14} />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
