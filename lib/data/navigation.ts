import { prisma } from "@/lib/db";
import { NavLocation } from "@prisma/client";

export async function getNavigation(location: NavLocation) {
  return prisma.navigationItem.findMany({
    where: { location, published: true },
    orderBy: { sortOrder: "asc" },
  });
}
