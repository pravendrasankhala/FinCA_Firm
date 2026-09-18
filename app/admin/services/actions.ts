"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";
import { serviceSchema, type ServiceInput } from "@/lib/validations/service";

function revalidateServicePaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/services");
  if (slug) revalidatePath(`/services/${slug}`);
}

export async function createService(input: ServiceInput) {
  const user = await requireAdmin();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const existing = await prisma.service.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { success: false as const, error: "A service with this slug already exists." };

  const count = await prisma.service.count();
  const service = await prisma.service.create({
    data: { ...parsed.data, sortOrder: count },
  });

  await logActivity({ userId: user.id, action: "create", entity: "Service", entityId: service.id });
  revalidateServicePaths(service.slug);
  redirect("/admin/services");
}

export async function updateService(id: string, input: ServiceInput) {
  const user = await requireAdmin();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const existing = await prisma.service.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) return { success: false as const, error: "A service with this slug already exists." };

  const service = await prisma.service.update({ where: { id }, data: parsed.data });

  await logActivity({ userId: user.id, action: "update", entity: "Service", entityId: id });
  revalidateServicePaths(service.slug);
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  const user = await requireAdmin();
  const service = await prisma.service.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "delete", entity: "Service", entityId: id });
  revalidateServicePaths(service.slug);
  return { success: true as const };
}

export async function toggleServicePublished(id: string, published: boolean) {
  await requireAdmin();
  const service = await prisma.service.update({ where: { id }, data: { published } });
  revalidateServicePaths(service.slug);
  return { success: true as const };
}

export async function reorderServices(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.service.update({ where: { id }, data: { sortOrder: index } }))
  );
  revalidateServicePaths();
  return { success: true as const };
}
