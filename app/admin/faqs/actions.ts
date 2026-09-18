"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { faqSchema, type FaqInput } from "@/lib/validations/faq";

async function revalidateForFaq(serviceId?: string | null) {
  revalidatePath("/admin/faqs");
  if (serviceId) {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (service) revalidatePath(`/services/${service.slug}`);
  }
}

export async function createFaq(input: FaqInput) {
  await requireAdmin();
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const count = await prisma.faq.count({ where: { serviceId: parsed.data.serviceId ?? null } });
  await prisma.faq.create({ data: { ...parsed.data, sortOrder: count } });
  await revalidateForFaq(parsed.data.serviceId);
  return { success: true as const };
}

export async function updateFaq(id: string, input: FaqInput) {
  await requireAdmin();
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  await prisma.faq.update({ where: { id }, data: parsed.data });
  await revalidateForFaq(parsed.data.serviceId);
  return { success: true as const };
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  const faq = await prisma.faq.delete({ where: { id } });
  await revalidateForFaq(faq.serviceId);
  return { success: true as const };
}

export async function reorderFaqs(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.faq.update({ where: { id }, data: { sortOrder: index } }))
  );
  revalidatePath("/admin/faqs");
  return { success: true as const };
}
