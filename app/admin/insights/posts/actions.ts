"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations/blog-post";
import { PostStatus } from "@prisma/client";

function sanitize(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "u"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
      a: ["href", "name", "target", "rel"],
      "*": ["style"],
    },
  });
}

function estimateReadingTime(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function resolvePublishedAt(status: PostStatus, publishedAt?: string) {
  if (status === PostStatus.PUBLISHED) return publishedAt ? new Date(publishedAt) : new Date();
  if (status === PostStatus.SCHEDULED) return publishedAt ? new Date(publishedAt) : null;
  return null;
}

function revalidateBlog(slug?: string) {
  revalidatePath("/");
  revalidatePath("/insights");
  if (slug) revalidatePath(`/insights/${slug}`);
}

export async function createBlogPost(input: BlogPostInput) {
  const user = await requireAdmin();
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const existing = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { success: false as const, error: "A post with this slug already exists." };

  const content = sanitize(parsed.data.content);

  const post = await prisma.blogPost.create({
    data: {
      ...parsed.data,
      content,
      categoryId: parsed.data.categoryId || null,
      readingTime: estimateReadingTime(content),
      publishedAt: resolvePublishedAt(parsed.data.status, parsed.data.publishedAt),
      authorId: user.id,
    },
  });

  await logActivity({ userId: user.id, action: "create", entity: "BlogPost", entityId: post.id });
  revalidateBlog(post.slug);
  redirect("/admin/insights/posts");
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  const user = await requireAdmin();
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const existing = await prisma.blogPost.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (existing) return { success: false as const, error: "A post with this slug already exists." };

  const content = sanitize(parsed.data.content);

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...parsed.data,
      content,
      categoryId: parsed.data.categoryId || null,
      readingTime: estimateReadingTime(content),
      publishedAt: resolvePublishedAt(parsed.data.status, parsed.data.publishedAt),
    },
  });

  await logActivity({ userId: user.id, action: "update", entity: "BlogPost", entityId: id });
  revalidateBlog(post.slug);
  redirect("/admin/insights/posts");
}

export async function deleteBlogPost(id: string) {
  const user = await requireAdmin();
  const post = await prisma.blogPost.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "delete", entity: "BlogPost", entityId: id });
  revalidateBlog(post.slug);
  return { success: true as const };
}
