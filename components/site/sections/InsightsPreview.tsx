import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { BlogPost, BlogCategory } from "@prisma/client";
import type { SectionIntroContent } from "@/lib/types/sections";
import { SectionIntro } from "@/components/site/SectionIntro";
import { formatDate } from "@/lib/format";

type PostWithCategory = BlogPost & { category: BlogCategory | null };

export function InsightsPreview({
  content,
  posts,
}: {
  content: SectionIntroContent;
  posts: PostWithCategory[];
}) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionIntro {...content} />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/insights/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-16/9 bg-navy-100">
                {post.featuredImage && (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                {post.category && (
                  <span className="text-xs font-semibold tracking-wide text-gold-600 uppercase">
                    {post.category.name}
                  </span>
                )}
                <h3 className="mt-2 text-base font-semibold text-foreground">{post.title}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">
                    Read
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
