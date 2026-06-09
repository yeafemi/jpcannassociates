import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide4 from "@/assets/hero-slide-4.jpg";
import heroSlide5 from "@/assets/hero-slide-5.jpg";
import heroAdvisory from "@/assets/hero-advisory.jpg";

const HERO_SLIDES = [
  {
    image: heroSlide1,
    alt: "Skyscrapers and a city expressway at sunrise",
  },
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070",
    alt: "Modern high-rise office building with glass facade",
  },
  {
    image: heroSlide5,
    alt: "Modern business district skyline at dusk",
  },
  {
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2044",
    alt: "Majestic city skyline featuring iconic skyscrapers",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&q=80&w=2070",
    alt: "Dramatic city skyscrapers bathed in golden sunset light",
  },
] as const;

const SLIDE_DURATION_MS = 6000;

export function HeroSlideshow({
  title,
  description,
  eyebrow,
}: {
  title?: string;
  description?: string;
  eyebrow?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const progressStyle = useMemo(
    () =>
      ({ "--hero-cycle-duration": `${SLIDE_DURATION_MS}ms` }) as CSSProperties,
    [],
  );

  return (
    <section className="hero-slideshow relative overflow-hidden text-primary-foreground">
      <div className="hero-slideshow__viewport absolute inset-0">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={`${slide.image}-${index}`}
              className="hero-slideshow__slide"
              data-active={isActive}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                width={1920}
                height={1080}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="hero-slideshow__image"
              />
            </div>
          );
        })}
        <div className="hero-slideshow__overlay absolute inset-0" />
        <div className="hero-slideshow__glow absolute inset-0" />
      </div>

      <div className="relative mx-auto grid min-h-[76svh] max-w-7xl items-end gap-10 px-4 py-22 md:grid-cols-12 md:px-6 md:py-28 lg:min-h-[84svh]">
        <Reveal className="md:col-span-8 lg:col-span-7" variant="right">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground backdrop-blur-sm">
            <ShieldCheck size={14} /> {eyebrow || "ISO 9001 & 27001 Accredited"}
          </p>
          <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-[1.05] md:text-6xl lg:text-7xl">
            {title ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: title
                    .replace(/—/g, '— <span class="text-accent">')
                    .replace(/ trust\./g, " trust.</span>"),
                }}
              />
            ) : (
              <>
                Advisory, operations and training —{" "}
                <span className="text-accent">engineered for trust.</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-primary-foreground/85 md:text-lg">
            {description ||
              "JPCann Associates is a Ghana-based professional services firm helping organisations design stronger businesses, run leaner operations and grow sharper talent."}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/advisory"
              data-magnetic="true"
              className="group interactive-lift inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-5 py-3 text-sm font-semibold text-primary-foreground backdrop-blur transition-all hover:bg-accent hover:text-accent-foreground hover:border-accent"
            >
              Advisory Services
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </Link>
            <Link
              to="/outsourcing"
              data-magnetic="true"
              className="group interactive-lift inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-5 py-3 text-sm font-semibold text-primary-foreground backdrop-blur transition-all hover:bg-accent hover:text-accent-foreground hover:border-accent"
            >
              Business Outsourcing
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </Link>
            <Link
              to="/trainings"
              data-magnetic="true"
              className="group interactive-lift inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-5 py-3 text-sm font-semibold text-primary-foreground backdrop-blur transition-all hover:bg-accent hover:text-accent-foreground hover:border-accent"
            >
              Capacity Building
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </Link>
          </div>
        </Reveal>

        <Reveal
          className="md:col-span-4 lg:col-span-5 md:self-end"
          variant="left"
          delay="1"
        >
          <div className="hero-slideshow__rail rounded-lg border border-primary-foreground/15 bg-primary-foreground/8 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-primary-foreground/70">
                  Live showcase
                </p>
                <p className="mt-2 text-sm text-primary-foreground/88">
                  Five curated slides over 30 seconds.
                </p>
              </div>
              <div className="hero-slideshow__counter text-right font-serif text-3xl text-primary-foreground/92">
                {String(activeIndex + 1).padStart(2, "0")}
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  aria-label={`Show hero slide ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  data-magnetic="true"
                  className="hero-slideshow__dot"
                  data-active={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <div
              className="hero-slideshow__progress mt-5"
              style={progressStyle}
              key={activeIndex}
            >
              <span className="hero-slideshow__progress-bar" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
