import { prisma } from "@/lib/db";

export async function getTrustStripItems() {
  return prisma.trustStripItem.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getWhyChooseUsFeatures() {
  return prisma.whyChooseUsFeature.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getProcessSteps() {
  return prisma.processStep.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getIndustries(limit?: number) {
  return prisma.industry.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export async function getStatistics() {
  return prisma.statistic.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getTeamMembers() {
  return prisma.teamMember.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getClientLogos() {
  return prisma.clientLogo.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}
