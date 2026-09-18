"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";
import { EnquiryStatus } from "@prisma/client";

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  const user = await requireAdmin();
  await prisma.enquiry.update({ where: { id }, data: { status } });
  await logActivity({ userId: user.id, action: "update-status", entity: "Enquiry", entityId: id });
  revalidatePath("/admin/leads");
  return { success: true as const };
}

export async function addEnquiryNote(enquiryId: string, note: string) {
  const user = await requireAdmin();
  if (!note.trim()) return { success: false as const, error: "Note cannot be empty." };

  await prisma.enquiryNote.create({ data: { enquiryId, note } });
  await logActivity({ userId: user.id, action: "add-note", entity: "Enquiry", entityId: enquiryId });
  revalidatePath("/admin/leads");
  return { success: true as const };
}
