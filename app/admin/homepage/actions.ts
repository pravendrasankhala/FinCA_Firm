"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";
import {
  trustStripItemSchema,
  whyChooseUsFeatureSchema,
  processStepSchema,
  statisticSchema,
  type TrustStripItemInput,
  type WhyChooseUsFeatureInput,
  type ProcessStepInput,
  type StatisticInput,
} from "@/lib/validations/homepage-lists";

function revalidateHome() {
  revalidatePath("/");
}

// --- Page sections (Hero, About, CTA, Contact, section intros, ordering) ---

export async function updateSectionContent(
  id: string,
  data: { title?: string | null; subtitle?: string | null; content?: object; media?: object }
) {
  const user = await requireAdmin();
  await prisma.pageSection.update({ where: { id }, data });
  await logActivity({ userId: user.id, action: "update", entity: "PageSection", entityId: id });
  revalidateHome();
  return { success: true as const };
}

export async function toggleSectionVisibility(id: string, isVisible: boolean) {
  await requireAdmin();
  await prisma.pageSection.update({ where: { id }, data: { isVisible } });
  revalidateHome();
  return { success: true as const };
}

export async function reorderSections(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.pageSection.update({ where: { id }, data: { sortOrder: index } }))
  );
  revalidateHome();
  return { success: true as const };
}

// --- Trust strip items ---

export async function createTrustItem(input: TrustStripItemInput) {
  await requireAdmin();
  const parsed = trustStripItemSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };
  const count = await prisma.trustStripItem.count();
  await prisma.trustStripItem.create({ data: { ...parsed.data, sortOrder: count } });
  revalidateHome();
  return { success: true as const };
}

export async function updateTrustItem(id: string, input: TrustStripItemInput) {
  await requireAdmin();
  const parsed = trustStripItemSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };
  await prisma.trustStripItem.update({ where: { id }, data: parsed.data });
  revalidateHome();
  return { success: true as const };
}

export async function deleteTrustItem(id: string) {
  await requireAdmin();
  await prisma.trustStripItem.delete({ where: { id } });
  revalidateHome();
  return { success: true as const };
}

export async function reorderTrustItems(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.trustStripItem.update({ where: { id }, data: { sortOrder: index } }))
  );
  revalidateHome();
  return { success: true as const };
}

// --- Why choose us features ---

export async function createFeature(input: WhyChooseUsFeatureInput) {
  await requireAdmin();
  const parsed = whyChooseUsFeatureSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };
  const count = await prisma.whyChooseUsFeature.count();
  await prisma.whyChooseUsFeature.create({ data: { ...parsed.data, sortOrder: count } });
  revalidateHome();
  return { success: true as const };
}

export async function updateFeature(id: string, input: WhyChooseUsFeatureInput) {
  await requireAdmin();
  const parsed = whyChooseUsFeatureSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };
  await prisma.whyChooseUsFeature.update({ where: { id }, data: parsed.data });
  revalidateHome();
  return { success: true as const };
}

export async function deleteFeature(id: string) {
  await requireAdmin();
  await prisma.whyChooseUsFeature.delete({ where: { id } });
  revalidateHome();
  return { success: true as const };
}

export async function reorderFeatures(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.whyChooseUsFeature.update({ where: { id }, data: { sortOrder: index } })
    )
  );
  revalidateHome();
  return { success: true as const };
}

// --- Process steps ---

export async function createProcessStep(input: ProcessStepInput) {
  await requireAdmin();
  const parsed = processStepSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };
  const count = await prisma.processStep.count();
  await prisma.processStep.create({ data: { ...parsed.data, sortOrder: count } });
  revalidateHome();
  return { success: true as const };
}

export async function updateProcessStep(id: string, input: ProcessStepInput) {
  await requireAdmin();
  const parsed = processStepSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };
  await prisma.processStep.update({ where: { id }, data: parsed.data });
  revalidateHome();
  return { success: true as const };
}

export async function deleteProcessStep(id: string) {
  await requireAdmin();
  await prisma.processStep.delete({ where: { id } });
  revalidateHome();
  return { success: true as const };
}

export async function reorderProcessSteps(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.processStep.update({ where: { id }, data: { sortOrder: index } }))
  );
  revalidateHome();
  return { success: true as const };
}

// --- Statistics ---

export async function createStatistic(input: StatisticInput) {
  await requireAdmin();
  const parsed = statisticSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };
  const count = await prisma.statistic.count();
  await prisma.statistic.create({ data: { ...parsed.data, sortOrder: count } });
  revalidateHome();
  return { success: true as const };
}

export async function updateStatistic(id: string, input: StatisticInput) {
  await requireAdmin();
  const parsed = statisticSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };
  await prisma.statistic.update({ where: { id }, data: parsed.data });
  revalidateHome();
  return { success: true as const };
}

export async function deleteStatistic(id: string) {
  await requireAdmin();
  await prisma.statistic.delete({ where: { id } });
  revalidateHome();
  return { success: true as const };
}

export async function reorderStatistics(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.statistic.update({ where: { id }, data: { sortOrder: index } }))
  );
  revalidateHome();
  return { success: true as const };
}

