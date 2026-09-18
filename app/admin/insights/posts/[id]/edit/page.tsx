import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BlogPostEditForm } from "./BlogPostEditForm";

export const dynamic = "force-dynamic";

function toDatetimeLocal(date: Date | null) {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export default async function EditBlogPostPage(props: PageProps<"/admin/insights/posts/[id]/edit">) {
  const { id } = await props.params;
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Edit Blog Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">{post.title}</p>
      </div>
      <BlogPostEditForm
        id={post.id}
        categories={categories}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featuredImage: post.featuredImage ?? "",
          categoryId: post.categoryId,
          tags: post.tags,
          seoTitle: post.seoTitle ?? "",
          seoDescription: post.seoDescription ?? "",
          ogImage: post.ogImage ?? "",
          canonicalUrl: post.canonicalUrl ?? "",
          status: post.status,
          featured: post.featured,
          publishedAt: toDatetimeLocal(post.publishedAt),
        }}
      />
    </div>
  );
}
