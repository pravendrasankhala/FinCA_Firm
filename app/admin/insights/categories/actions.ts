"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { blogCategorySchema, type BlogCategoryInput } from "@/lib/validations/blog-category";

function revalidateInsights() {
  revalidatePath("/insights");
  revalidatePath("/");
}

export async function createBlogCategory(input: BlogCategoryInput) {
  await requireAdmin();
  const parsed = blogCategorySchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const existing = await prisma.blogCategory.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { success: false as const, error: "A category with this slug already exists." };

  const count = await prisma.blogCategory.count();
  await prisma.blogCategory.create({ data: { ...parsed.data, sortOrder: count } });
  revalidateInsights();
  return { success: true as const };
}

export async function updateBlogCategory(id: string, input: BlogCategoryInput) {
  await requireAdmin();
  const parsed = blogCategorySchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const existing = await prisma.blogCategory.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (existing) return { success: false as const, error: "A category with this slug already exists." };

  await prisma.blogCategory.update({ where: { id }, data: parsed.data });
  revalidateInsights();
  return { success: true as const };
}

export async function deleteBlogCategory(id: string) {
  await requireAdmin();
  await prisma.blogCategory.delete({ where: { id } });
  revalidateInsights();
  return { success: true as const };
}

export async function reorderBlogCategories(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.blogCategory.update({ where: { id }, data: { sortOrder: index } }))
  );
  revalidateInsights();
  return { success: true as const };
}
