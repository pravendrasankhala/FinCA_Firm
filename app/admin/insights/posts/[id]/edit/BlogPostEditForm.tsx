"use client";

import { BlogPostForm } from "@/components/admin/insights/BlogPostForm";
import { updateBlogPost } from "@/app/admin/insights/posts/actions";
import type { BlogPostInput } from "@/lib/validations/blog-post";
import type { BlogCategory } from "@prisma/client";

export function BlogPostEditForm({
  id,
  categories,
  defaultValues,
}: {
  id: string;
  categories: BlogCategory[];
  defaultValues: Partial<BlogPostInput>;
}) {
  return (
    <BlogPostForm
      categories={categories}
      defaultValues={defaultValues}
      onSubmit={(input) => updateBlogPost(id, input)}
    />
  );
}
