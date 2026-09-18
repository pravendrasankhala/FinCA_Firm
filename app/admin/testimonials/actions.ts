"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations/testimonial";

export async function createTestimonial(input: TestimonialInput) {
  const user = await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const count = await prisma.testimonial.count();
  const testimonial = await prisma.testimonial.create({ data: { ...parsed.data, sortOrder: count } });
  await logActivity({ userId: user.id, action: "create", entity: "Testimonial", entityId: testimonial.id });
  revalidatePath("/");
  return { success: true as const };
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  const user = await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  await prisma.testimonial.update({ where: { id }, data: parsed.data });
  await logActivity({ userId: user.id, action: "update", entity: "Testimonial", entityId: id });
  revalidatePath("/");
  return { success: true as const };
}

export async function deleteTestimonial(id: string) {
  const user = await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "delete", entity: "Testimonial", entityId: id });
  revalidatePath("/");
  return { success: true as const };
}

export async function toggleTestimonialPublished(id: string, published: boolean) {
  await requireAdmin();
  await prisma.testimonial.update({ where: { id }, data: { published } });
  revalidatePath("/");
  return { success: true as const };
}

export async function reorderTestimonials(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.testimonial.update({ where: { id }, data: { sortOrder: index } }))
  );
  revalidatePath("/");
  return { success: true as const };
}
