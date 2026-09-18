import { prisma } from "@/lib/db";
import { HomepageAdminClient } from "@/components/admin/homepage/HomepageAdminClient";

export const dynamic = "force-dynamic";

export default async function HomepageAdminPage() {
  const [sections, trustItems, features, steps, stats] = await Promise.all([
    prisma.pageSection.findMany({ where: { page: "home" }, orderBy: { sortOrder: "asc" } }),
    prisma.trustStripItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.whyChooseUsFeature.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.processStep.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.statistic.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Homepage</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage every section of the homepage from here.
        </p>
      </div>
      <HomepageAdminClient
        sections={sections}
        trustItems={trustItems}
        features={features}
        steps={steps}
        stats={stats}
      />
    </div>
  );
}
