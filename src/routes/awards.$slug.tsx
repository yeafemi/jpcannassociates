import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Trophy,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Calendar,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { getDirectImageUrl } from "@/utils/image";

type AwardRow = {
  id: string;
  item_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  metadata: Record<string, unknown> & {
    gallery?: string[];
  };
};

export const Route = createFileRoute("/awards/$slug")({
  component: AwardDetailPage,
  head: () => ({
    meta: [{ title: `Award Details — JPCann Associates Limited` }],
  }),
});

function AwardDetailPage() {
  const { slug } = Route.useParams();
  const [award, setAward] = useState<AwardRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("site_collections")
          .select("*")
          .eq("collection_key", "awards")
          .eq("item_key", slug)
          .maybeSingle();

        if (!error && data && !cancelled) {
          setAward(data as AwardRow);
        }
      } catch (e) {
        console.error("Error fetching award details", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const gallery = award?.metadata?.gallery ?? [];

  const handlePrev = () => {
    if (activePhotoIdx === null || !gallery.length) return;
    setActivePhotoIdx((prev) => (prev === 0 ? gallery.length - 1 : prev! - 1));
  };

  const handleNext = () => {
    if (activePhotoIdx === null || !gallery.length) return;
    setActivePhotoIdx((prev) => (prev === gallery.length - 1 ? 0 : prev! + 1));
  };

  useEffect(() => {
    if (activePhotoIdx === null) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setActivePhotoIdx(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIdx, gallery]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center text-sm text-muted-foreground">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
          Loading award details…
        </div>
      </SiteLayout>
    );
  }

  if (!award) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Trophy size={24} />
          </div>
          <h1 className="font-serif text-3xl font-bold mt-6 text-foreground">
            Award Not Found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The award you are trying to view does not exist or has been removed.
          </p>
          <Link
            to="/awards"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
          >
            <ArrowLeft size={16} /> Back to Awards
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* Premium Hero Banner */}
      <section
        className="relative overflow-hidden text-primary-foreground min-h-[40vh] flex items-center"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_10%,white,transparent_40%),radial-gradient(circle_at_80%_90%,var(--accent),transparent_45%)]" />

        {award.image_url && (
          <div className="absolute inset-0 z-0">
            <img
              src={getDirectImageUrl(award.image_url)}
              alt=""
              className="h-full w-full object-cover opacity-15 mix-blend-overlay filter blur-sm scale-105"
            />
          </div>
        )}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <Link
            to="/awards"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back to Awards
          </Link>
          <Reveal variant="up">
            <h1 className="font-serif text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl max-w-4xl">
              {award.title}
            </h1>
            {award.subtitle && (
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
                <Calendar size={14} />
                {award.subtitle}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* Details & Gallery Split Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Description Column */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal variant="up">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                About The Award
              </h2>
              <div className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap space-y-4 font-sans">
                {award.description || "No description provided for this award."}
              </div>
            </Reveal>

            {award.image_url && (
              <Reveal variant="up" className="pt-6 border-t border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Award Icon / Cover
                </p>
                <div className="rounded-2xl overflow-hidden border border-border shadow-sm bg-card aspect-[4/3] max-w-sm">
                  <img
                    src={getDirectImageUrl(award.image_url)}
                    alt={award.title}
                    className="w-full h-full object-contain p-4 bg-muted/10"
                  />
                </div>
              </Reveal>
            )}
          </div>

          {/* Right Gallery Grid Column */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal variant="up">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                Ceremony & Photo Gallery
              </h2>
              {gallery.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center text-muted-foreground text-sm">
                  No pictures uploaded to this award's gallery.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gallery.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-border bg-muted shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
                    >
                      <img
                        src={getDirectImageUrl(url)}
                        alt={`Gallery photograph ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xs font-semibold">
                        View Photo
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Lightbox / Slideshow Modal */}
      {activePhotoIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <button
            onClick={() => setActivePhotoIdx(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 bg-white/10 rounded-full"
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>

          {/* Navigation Controls */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-6 text-white/70 hover:text-white transition-colors p-3 bg-white/10 rounded-full select-none"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-6 text-white/70 hover:text-white transition-colors p-3 bg-white/10 rounded-full select-none"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Render Active Image */}
          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
            <img
              src={getDirectImageUrl(gallery[activePhotoIdx])}
              alt={`Gallery detail ${activePhotoIdx + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
            />
            {gallery.length > 1 && (
              <p className="text-white/60 text-xs font-semibold mt-4 uppercase tracking-widest">
                Photo {activePhotoIdx + 1} of {gallery.length}
              </p>
            )}
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
