"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validations/team";

export async function createTeamMember(input: TeamMemberInput) {
  const user = await requireAdmin();
  const parsed = teamMemberSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const count = await prisma.teamMember.count();
  const member = await prisma.teamMember.create({ data: { ...parsed.data, sortOrder: count } });
  await logActivity({ userId: user.id, action: "create", entity: "TeamMember", entityId: member.id });
  revalidatePath("/");
  return { success: true as const };
}

export async function updateTeamMember(id: string, input: TeamMemberInput) {
  const user = await requireAdmin();
  const parsed = teamMemberSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  await prisma.teamMember.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: user.id, action: "update", entity: "TeamMember", entityId: id });
  revalidatePath("/");
  return { success: true as const };
}

export async function deleteTeamMember(id: string) {
  const user = await requireAdmin();
  await prisma.teamMember.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "delete", entity: "TeamMember", entityId: id });
  revalidatePath("/");
  return { success: true as const };
}

export async function toggleTeamMemberPublished(id: string, published: boolean) {
  await requireAdmin();
  await prisma.teamMember.update({ where: { id }, data: { published } });
  revalidatePath("/");
  return { success: true as const };
}

export async function reorderTeamMembers(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.teamMember.update({ where: { id }, data: { sortOrder: index } }))
  );
  revalidatePath("/");
  return { success: true as const };
}
