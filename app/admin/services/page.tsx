import { prisma } from "@/lib/db";
import { ServicesManager } from "@/components/admin/services/ServicesManager";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return <ServicesManager services={services} />;
}
