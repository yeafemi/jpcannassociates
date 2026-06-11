import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Facebook,
  Linkedin,
  Instagram,
  MessageCircle,
} from "lucide-react";
import logo from "@/assets/jpcann-logo.png";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  {
    to: "/about",
    label: "About",
    submenu: [
      { to: "/management", label: "Management" },
      { to: "/staff", label: "Staff" },
      { to: "/facilitators", label: "Facilitators" },
      { to: "/approach", label: "Our Approach" },
      { to: "/awards", label: "Awards" },
      { to: "/careers", label: "Careers" },
    ],
  },
  {
    label: "Services",
    submenu: [
      { to: "/advisory", label: "Advisory" },
      { to: "/outsourcing", label: "Outsourcing" },
      {
        to: "/corporate-training",
        label: "Corporate Training & Capacity Development",
      },
    ],
  },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/trainings", label: "Trainings" },
  {
    label: "Resources",
    submenu: [
      { to: "/brochures", label: "Training Brochures" },
      { to: "/ebooks", label: "E-books" },
      { to: "/blogs", label: "Blogs" },
    ],
  },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  // Dynamic Banner State with 2026 calendar defaults
  const [banner, setBanner] = useState<{
    isPublished: boolean;
    title: string;
    linkLabel: string;
    linkUrl: string;
    bgType: "solid" | "gradient";
    bgSolidColor: string;
    bgGradientStart: string;
    bgGradientVia: string;
    bgGradientEnd: string;
    textColor: string;
    accentColor: string;
  }>({
    isPublished: true,
    title: "to download the 2026 training calendar",
    linkLabel: "Click here",
    linkUrl: "/brochures/2026-training-brochure",
    bgType: "gradient",
    bgSolidColor: "#0c1e36",
    bgGradientStart: "#0c1e36",
    bgGradientVia: "#1e3a5f",
    bgGradientEnd: "#14b8a6",
    textColor: "#ffffff",
    accentColor: "#14b8a6",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("site_collections")
          .select("*")
          .eq("collection_key", "site-banner")
          .eq("item_key", "main-banner")
          .maybeSingle();

        if (!error && data && !cancelled) {
          const meta = (data.metadata || {}) as any;
          setBanner({
            isPublished: data.is_published,
            title: data.title || "",
            linkLabel: data.link_label || "",
            linkUrl: data.link_url || "",
            bgType: meta.bg_type || "gradient",
            bgSolidColor: meta.bg_solid_color || "#0c1e36",
            bgGradientStart: meta.bg_gradient_start || "#0c1e36",
            bgGradientVia: meta.bg_gradient_via || "#1e3a5f",
            bgGradientEnd: meta.bg_gradient_end || "#14b8a6",
            textColor: meta.text_color || "#ffffff",
            accentColor: meta.accent_color || "#14b8a6",
          });
        }
      } catch (e) {
        console.error("Error loading header banner", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isExternal =
    banner.linkUrl.startsWith("http://") ||
    banner.linkUrl.startsWith("https://") ||
    banner.linkUrl.startsWith("//");

  const bannerStyle = {
    background:
      banner.bgType === "gradient"
        ? `linear-gradient(to right, ${banner.bgGradientStart}, ${banner.bgGradientVia}, ${banner.bgGradientEnd})`
        : banner.bgSolidColor,
    color: banner.textColor,
    "--banner-accent": banner.accentColor,
  } as React.CSSProperties;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      {/* Promotional Banner */}
      {banner.isPublished && (
        <div
          style={bannerStyle}
          className="relative z-50 px-4 py-2.5 text-center text-xs sm:text-sm font-medium shadow-sm transition-all duration-300"
        >
          {isExternal ? (
            <a
              href={banner.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--banner-accent)" }}
              className="font-semibold underline decoration-2 underline-offset-2 transition-colors duration-250 hover:opacity-85"
            >
              {banner.linkLabel}
            </a>
          ) : (
            <Link
              to={banner.linkUrl as any}
              style={{ color: "var(--banner-accent)" }}
              className="font-semibold underline decoration-2 underline-offset-2 transition-colors duration-250 hover:opacity-85"
            >
              {banner.linkLabel}
            </Link>
          )}{" "}
          {banner.title}
        </div>
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="JPCann Associates Limited"
            className="h-10 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <div
              key={n.label}
              className="relative py-4"
              onMouseEnter={() => "submenu" in n && setHoveredMenu(n.label)}
              onMouseLeave={() => "submenu" in n && setHoveredMenu(null)}
            >
              {"to" in n ? (
                <Link
                  to={n.to}
                  className="story-link-soft text-sm font-medium text-foreground/75 transition-colors duration-200 hover:text-primary"
                  activeProps={{
                    className: "story-link-soft text-primary font-semibold",
                  }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ) : (
                <span className="cursor-default text-sm font-medium text-foreground/75 transition-colors duration-200 hover:text-primary">
                  {n.label}
                </span>
              )}
              {"submenu" in n && hoveredMenu === n.label && (
                <div className="absolute left-0 top-full min-w-[200px] animate-fade-up-soft rounded-lg border border-border bg-background/95 p-2 shadow-xl backdrop-blur-md">
                  {n.submenu?.map((s) => (
                    <Link
                      key={s.to}
                      to={s.to}
                      className="block rounded-md px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary"
                      activeProps={{
                        className: "text-primary font-semibold bg-primary/5",
                      }}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/contact"
            className="interactive-lift inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            Free Consultation
          </Link>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {nav.map((n) => (
              <div key={n.label}>
                {"to" in n ? (
                  <Link
                    to={n.to}
                    onClick={() => !("submenu" in n) && setOpen(false)}
                    className="block py-2 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-primary"
                    activeProps={{
                      className: "py-2 text-sm font-medium text-primary",
                    }}
                    activeOptions={{ exact: n.to === "/" }}
                  >
                    {n.label}
                  </Link>
                ) : (
                  <span className="block py-2 text-sm font-medium text-foreground/80">
                    {n.label}
                  </span>
                )}
                {"submenu" in n && (
                  <div className="ml-4 flex flex-col border-l border-border pl-4">
                    {n.submenu?.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        onClick={() => setOpen(false)}
                        className="py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                        activeProps={{ className: "text-primary font-medium" }}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
