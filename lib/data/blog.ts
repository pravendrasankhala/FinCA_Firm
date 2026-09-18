import { prisma } from "@/lib/db";
import { PostStatus } from "@prisma/client";

export async function getPublishedPosts(limit?: number) {
  return prisma.blogPost.findMany({
    where: { status: PostStatus.PUBLISHED },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: PostStatus.PUBLISHED },
    include: { category: true, author: true },
  });
}

export async function getPublishedCategories() {
  return prisma.blogCategory.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}
