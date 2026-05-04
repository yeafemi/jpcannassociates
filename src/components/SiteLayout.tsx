import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Reveal } from "./Reveal";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section
      className="relative overflow-hidden text-primary-foreground"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_10%,white,transparent_40%),radial-gradient(circle_at_80%_90%,var(--accent),transparent_45%)]" />
      <Reveal
        className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28"
        variant="up"
      >
        {eyebrow && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base text-primary-foreground/80 md:text-lg">
            {description}
          </p>
        )}
      </Reveal>
    </section>
  );
}
