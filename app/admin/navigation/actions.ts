"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { NavLocation } from "@prisma/client";
import { navigationItemSchema, type NavigationItemInput } from "@/lib/validations/navigation";

export async function createNavigationItem(location: NavLocation, input: NavigationItemInput) {
  await requireAdmin();
  const parsed = navigationItemSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const count = await prisma.navigationItem.count({ where: { location } });
  await prisma.navigationItem.create({ data: { ...parsed.data, location, sortOrder: count } });
  revalidatePath("/");
  return { success: true as const };
}

export async function updateNavigationItem(id: string, input: NavigationItemInput) {
  await requireAdmin();
  const parsed = navigationItemSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  await prisma.navigationItem.update({ where: { id }, data: parsed.data });
  revalidatePath("/");
  return { success: true as const };
}

export async function deleteNavigationItem(id: string) {
  await requireAdmin();
  await prisma.navigationItem.delete({ where: { id } });
  revalidatePath("/");
  return { success: true as const };
}

export async function reorderNavigationItems(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.navigationItem.update({ where: { id }, data: { sortOrder: index } })
    )
  );
  revalidatePath("/");
  return { success: true as const };
}
