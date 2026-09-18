"use server";

import { prisma } from "@/lib/db";
import { enquirySchema, type EnquiryInput } from "@/lib/validations/enquiry";

export async function submitEnquiry(input: EnquiryInput) {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Please check the form and try again." };
  }

  await prisma.enquiry.create({ data: parsed.data });

  return { success: true as const };
}
