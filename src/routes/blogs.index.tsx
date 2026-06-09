import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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
  };
};

export const Route = createFileRoute("/blogs/")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Blogs & Insights — JPCann Associates Limited" },
      {
        name: "description",
        content:
          "Stay updated with the latest business insights, news, and professional advice from JPCann Associates.",
      },
    ],
  }),
});

function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("site_collections")
        .select(
          "id,item_key,title,subtitle,description,image_url,created_at,metadata",
        )
        .eq("collection_key", "blog_posts")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!error && data) setPosts(data as BlogPost[]);
      setIsLoading(false);
    })();
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Journal"
        title="Perspectives on growth and governance."
        description="Thought leadership and practical advice for navigating the complex landscape of modern business."
      />

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading articles...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <p className="font-serif text-xl text-foreground">
              No articles published yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for new insights.
            </p>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-2">
            {posts.map((post, idx) => (
              <Reveal
                key={post.id}
                variant="up"
                delay={String(idx % 2) as any}
                className="group relative flex flex-col gap-6"
              >
                <Link
                  to="/blogs/$slug"
                  params={{ slug: post.item_key }}
                  className="relative aspect-video overflow-hidden rounded-2xl bg-secondary/20 shadow-sm transition-all hover:shadow-lg"
                >
                  <img
                    src={post.image_url ?? ""}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                </Link>
                <div className="flex flex-col">
                  <div className="mb-3 flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-accent">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {format(new Date(post.created_at), "MMMM d, yyyy")}
                    </span>
                    {post.metadata?.author && (
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {post.metadata.author}
                      </span>
                    )}
                  </div>
                  <Link to="/blogs/$slug" params={{ slug: post.item_key }}>
                    <h2 className="font-serif text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="mt-4 text-muted-foreground line-clamp-3">
                    {post.description}
                  </p>
                  <Link
                    to="/blogs/$slug"
                    params={{ slug: post.item_key }}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all hover:translate-x-1"
                  >
                    Read article <ArrowRight size={16} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
