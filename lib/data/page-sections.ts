import { prisma } from "@/lib/db";

export async function getVisibleSections(page: string) {
  return prisma.pageSection.findMany({
    where: { page, isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}
