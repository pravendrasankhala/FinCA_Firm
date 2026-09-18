"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";
import { clientLogoSchema, type ClientLogoInput } from "@/lib/validations/client-logo";

export async function createClientLogo(input: ClientLogoInput) {
  const user = await requireAdmin();
  const parsed = clientLogoSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const count = await prisma.clientLogo.count();
  const logo = await prisma.clientLogo.create({ data: { ...parsed.data, sortOrder: count } });
  await logActivity({ userId: user.id, action: "create", entity: "ClientLogo", entityId: logo.id });
  revalidatePath("/");
  return { success: true as const };
}

export async function updateClientLogo(id: string, input: ClientLogoInput) {
  const user = await requireAdmin();
  const parsed = clientLogoSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  await prisma.clientLogo.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: user.id, action: "update", entity: "ClientLogo", entityId: id });
  revalidatePath("/");
  return { success: true as const };
}

export async function deleteClientLogo(id: string) {
  const user = await requireAdmin();
  await prisma.clientLogo.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "delete", entity: "ClientLogo", entityId: id });
  revalidatePath("/");
  return { success: true as const };
}

export async function toggleClientLogoPublished(id: string, published: boolean) {
  await requireAdmin();
  await prisma.clientLogo.update({ where: { id }, data: { published } });
  revalidatePath("/");
  return { success: true as const };
}

export async function reorderClientLogos(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.clientLogo.update({ where: { id }, data: { sortOrder: index } }))
  );
  revalidatePath("/");
  return { success: true as const };
}
