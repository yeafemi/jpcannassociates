import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, User, ChevronLeft, Share2, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { getDirectImageUrl } from "@/utils/image";

type BlogPost = {
  id: string;
  item_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  metadata: Record<string, unknown> & {
    author?: string;
    reading_time?: string;
    content?: string;
  };
};

export const Route = createFileRoute("/blogs/$slug")({
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("site_collections")
        .select("*")
        .eq("collection_key", "blog_posts")
        .eq("item_key", slug)
        .maybeSingle();

      if (!error && data) setPost(data as BlogPost);
      setIsLoading(false);
    })();
  }, [slug]);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </SiteLayout>
    );
  }

  if (!post) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-3xl">Article not found</h1>
          <p className="mt-4 text-muted-foreground">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blogs"
            className="mt-8 inline-flex items-center gap-2 font-bold text-primary"
          >
            <ChevronLeft size={20} /> Back to Blogs
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="relative">
        {/* Post Header */}
        <header className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          <img
            src={getDirectImageUrl(post.image_url)}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 md:px-6">
              <Reveal variant="right">
                <Link
                  to="/blogs"
                  className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/80 transition-colors hover:text-white"
                >
                  <ChevronLeft size={16} /> Journal
                </Link>
                <div className="mb-4 flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-accent">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {format(new Date(post.created_at), "MMMM d, yyyy")}
                  </span>
                  {post.metadata?.author && (
                    <span className="flex items-center gap-1.5 border-l border-white/20 pl-4">
                      <User size={14} />
                      {post.metadata.author}
                    </span>
                  )}
                </div>
                <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                  {post.title}
                </h1>
              </Reveal>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
          <div className="prose prose-lg prose-slate max-w-none dark:prose-invert prose-headings:font-serif prose-p:leading-relaxed">
            {post.metadata?.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: post.metadata.content }}
              />
            ) : (
              <p className="italic text-muted-foreground">
                This article has no content yet.
              </p>
            )}
          </div>

          <div className="mt-16 flex items-center justify-between border-t border-border pt-10">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:bg-primary hover:text-white"
              >
                <Share2 size={18} />
              </button>
            </div>
            <Link
              to="/blogs"
              className="font-serif text-lg font-bold text-primary hover:underline"
            >
              More from the Journal
            </Link>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
