import { prisma } from "@/lib/db";
import { BlogPostForm } from "@/components/admin/insights/BlogPostForm";
import { createBlogPost } from "@/app/admin/insights/posts/actions";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  const categories = await prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Add Blog Post</h1>
      </div>
      <BlogPostForm categories={categories} onSubmit={createBlogPost} />
    </div>
  );
}
