import { prisma } from "@/lib/db";

export async function getPublishedServices(limit?: number) {
  return prisma.service.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export async function getFeaturedServices() {
  return prisma.service.findMany({
    where: { published: true, featured: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findFirst({
    where: { slug, published: true },
    include: { faqs: { where: { published: true }, orderBy: { sortOrder: "asc" } } },
  });
}
