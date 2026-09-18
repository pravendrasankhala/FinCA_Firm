import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/data/blog";
import { getSiteSettings } from "@/lib/data/settings";
import { formatDate } from "@/lib/format";

export async function generateMetadata(
  props: PageProps<"/insights/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const settings = await getSiteSettings();
  return {
    title: post.seoTitle || `${post.title} | ${settings.firmName}`,
    description: post.seoDescription || post.excerpt,
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.ogImage || post.featuredImage ? [post.ogImage || post.featuredImage!] : undefined,
    },
  };
}

export default async function InsightDetailPage(props: PageProps<"/insights/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
      <div className="text-center">
        {post.category && (
          <Link
            href={`/insights?category=${post.category.slug}`}
            className="text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase"
          >
            {post.category.name}
          </Link>
        )}
        <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">{post.title}</h1>
        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          {post.author?.name && <span>{post.author.name}</span>}
          <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
          {post.readingTime && <span>{post.readingTime} min read</span>}
        </div>
      </div>

      {post.featuredImage && (
        <div className="relative mt-10 aspect-16/9 overflow-hidden rounded-2xl bg-navy-100">
          <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div
        className="prose prose-neutral mt-10 max-w-none prose-headings:font-heading prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
