import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PostStatus } from "@prisma/client";
import { getPublishedCategories } from "@/lib/data/blog";
import { getSiteSettings } from "@/lib/data/settings";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Insights | ${settings.firmName}`,
    description: `Perspectives on tax, compliance and business finance from ${settings.firmName}.`,
  };
}

export default async function InsightsPage(props: PageProps<"/insights">) {
  const searchParams = await props.searchParams;
  const categorySlug = typeof searchParams.category === "string" ? searchParams.category : undefined;

  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        category: categorySlug ? { slug: categorySlug } : undefined,
      },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    getPublishedCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">Insights</p>
        <h1 className="mt-4 text-4xl font-semibold text-foreground">Latest Thinking & Updates</h1>
        <p className="mt-4 text-base text-muted-foreground">
          Practical perspectives on tax, compliance and business finance.
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          <Link
            href="/insights"
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium",
              !categorySlug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/insights?category=${category.slug}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium",
                categorySlug === category.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="mt-14 text-sm text-muted-foreground">No posts published yet.</p>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                <h2 className="mt-2 text-base font-semibold text-foreground">{post.title}</h2>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
                  {post.readingTime && <span>{post.readingTime} min read</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
