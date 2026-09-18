import { prisma } from "@/lib/db";
import { IndustryManager } from "@/components/admin/industries/IndustryManager";

export const dynamic = "force-dynamic";

export default async function IndustriesAdminPage() {
  const industries = await prisma.industry.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Industries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Industries shown in the homepage &quot;Industries We Serve&quot; section.
        </p>
      </div>
      <IndustryManager industries={industries} />
    </div>
  );
}
