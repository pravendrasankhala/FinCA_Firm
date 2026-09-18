"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";
import {
  generalSettingsSchema,
  seoSettingsSchema,
  socialLinksSchema,
  type GeneralSettingsInput,
  type SeoSettingsInput,
  type SocialLinksInput,
} from "@/lib/validations/site-settings";

async function ensureSettingsRow() {
  return prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", firmName: "Aurevia & Co.", tagline: "" },
  });
}

export async function updateGeneralSettings(input: GeneralSettingsInput) {
  const user = await requireAdmin();
  const parsed = generalSettingsSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  await ensureSettingsRow();
  await prisma.siteSettings.update({ where: { id: "singleton" }, data: parsed.data });
  await logActivity({ userId: user.id, action: "update", entity: "SiteSettings" });
  revalidatePath("/");
  revalidatePath("/admin", "layout");
  return { success: true as const };
}

export async function updateSeoSettings(input: SeoSettingsInput) {
  const user = await requireAdmin();
  const parsed = seoSettingsSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  await ensureSettingsRow();
  await prisma.siteSettings.update({ where: { id: "singleton" }, data: parsed.data });
  await logActivity({ userId: user.id, action: "update", entity: "SiteSettings.SEO" });
  revalidatePath("/");
  return { success: true as const };
}

export async function updateSocialLinks(input: SocialLinksInput) {
  const user = await requireAdmin();
  const parsed = socialLinksSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  await ensureSettingsRow();
  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: { socialLinks: parsed.data },
  });
  await logActivity({ userId: user.id, action: "update", entity: "SiteSettings.Social" });
  revalidatePath("/");
  return { success: true as const };
}
