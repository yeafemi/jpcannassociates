import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Menu,
  X,
  Facebook,
  Linkedin,
  Instagram,
  MessageCircle,
} from "lucide-react";
import logo from "@/assets/jpcann-logo.png";

const nav = [
  {
    to: "/about",
    label: "About",
    submenu: [
      { to: "/management", label: "Management" },
      { to: "/staff", label: "Staff" },
      { to: "/facilitators", label: "Facilitators" },
      { to: "/approach", label: "Our Approach" },
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
  { to: "/contact", label: "Contact" },
  { to: "/ebooks", label: "E-books" },
  { to: "/blogs", label: "Blogs" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
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
