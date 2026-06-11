import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { Reveal } from "./Reveal";
import affiliateLogos from "@/assets/affiliate-logos.png";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <Reveal
        className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6"
        variant="up"
      >
        <div>
          <h3 className="font-serif text-xl">JPCann Associates Limited</h3>
          <p className="mt-3 text-sm text-primary-foreground/75">
            ISO-accredited business advisory, BPO, and professional training —
            helping organisations operate with clarity, confidence, and
            compliance.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">
            Explore
          </h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link
                to="/about"
                className="story-link-soft transition-colors duration-200 hover:text-accent"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/advisory"
                className="story-link-soft transition-colors duration-200 hover:text-accent"
              >
                Advisory
              </Link>
            </li>
            <li>
              <Link
                to="/outsourcing"
                className="story-link-soft transition-colors duration-200 hover:text-accent"
              >
                Outsourcing
              </Link>
            </li>
            <li>
              <Link
                to="/iso"
                className="story-link-soft transition-colors duration-200 hover:text-accent"
              >
                ISO Accreditation
              </Link>
            </li>
            <li>
              <Link
                to="/awards"
                className="story-link-soft transition-colors duration-200 hover:text-accent"
              >
                Awards
              </Link>
            </li>
            <li>
              <Link
                to="/portfolio"
                className="story-link-soft transition-colors duration-200 hover:text-accent"
              >
                Portfolio
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link
                to="/trainings"
                className="story-link-soft transition-colors duration-200 hover:text-accent"
              >
                Trainings
              </Link>
            </li>
            <li>
              <Link
                to="/ebooks"
                className="story-link-soft transition-colors duration-200 hover:text-accent"
              >
                E-books
              </Link>
            </li>
            <li>
              <Link
                to="/brochures"
                className="story-link-soft transition-colors duration-200 hover:text-accent"
              >
                Training Brochures
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className="story-link-soft transition-colors duration-200 hover:text-accent"
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                to="/careers"
                className="story-link-soft transition-colors duration-200 hover:text-accent"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="story-link-soft transition-colors duration-200 hover:text-accent"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" /> Accra, Ghana
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 shrink-0" />{" "}
              info@jpcannassociates.com
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 shrink-0" /> +233 50 133 5818 /
              +233 24 112 1761
            </li>
          </ul>
        </div>
      </Reveal>
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-primary-foreground/70 md:flex-row md:px-6">
          <p>
            © {new Date().getFullYear()} JPCann Associates Limited. All rights
            reserved.
          </p>
          <img
            src={affiliateLogos}
            alt="Affiliate Logos"
            className="h-10 w-auto object-contain"
          />
          <p>ISO 9001 · ISO 27001 Accredited</p>
        </div>
      </div>
    </footer>
  );
}
