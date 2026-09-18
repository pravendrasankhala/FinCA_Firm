"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";
import { industrySchema, type IndustryInput } from "@/lib/validations/industry";

function revalidateIndustries() {
  revalidatePath("/");
  revalidatePath("/admin/industries");
}

export async function createIndustry(input: IndustryInput) {
  const user = await requireAdmin();
  const parsed = industrySchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const existing = await prisma.industry.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { success: false as const, error: "An industry with this slug already exists." };

  const count = await prisma.industry.count();
  const industry = await prisma.industry.create({ data: { ...parsed.data, sortOrder: count } });
  await logActivity({ userId: user.id, action: "create", entity: "Industry", entityId: industry.id });
  revalidateIndustries();
  return { success: true as const };
}

export async function updateIndustry(id: string, input: IndustryInput) {
  const user = await requireAdmin();
  const parsed = industrySchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const existing = await prisma.industry.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (existing) return { success: false as const, error: "An industry with this slug already exists." };

  await prisma.industry.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: user.id, action: "update", entity: "Industry", entityId: id });
  revalidateIndustries();
  return { success: true as const };
}

export async function deleteIndustry(id: string) {
  const user = await requireAdmin();
  await prisma.industry.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "delete", entity: "Industry", entityId: id });
  revalidateIndustries();
  return { success: true as const };
}

export async function toggleIndustryPublished(id: string, published: boolean) {
  await requireAdmin();
  await prisma.industry.update({ where: { id }, data: { published } });
  revalidateIndustries();
  return { success: true as const };
}

export async function reorderIndustries(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.industry.update({ where: { id }, data: { sortOrder: index } }))
  );
  revalidateIndustries();
  return { success: true as const };
}
