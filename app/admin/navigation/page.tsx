import { prisma } from "@/lib/db";
import { NavLocation } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationManager } from "@/components/admin/navigation/NavigationManager";

export const dynamic = "force-dynamic";

export default async function NavigationAdminPage() {
  const [headerItems, ctaItems] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { location: NavLocation.HEADER },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.navigationItem.findMany({
      where: { location: NavLocation.HEADER_CTA },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Navigation</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage the main header menu.</p>
      </div>
      <Tabs defaultValue="header">
        <TabsList>
          <TabsTrigger value="header">Header Menu</TabsTrigger>
          <TabsTrigger value="cta">Header Button</TabsTrigger>
        </TabsList>
        <TabsContent value="header" className="mt-6">
          <NavigationManager location={NavLocation.HEADER} items={headerItems} />
        </TabsContent>
        <TabsContent value="cta" className="mt-6">
          <p className="mb-4 text-xs text-muted-foreground">
            Only the first item is shown, as the header&apos;s call-to-action button.
          </p>
          <NavigationManager location={NavLocation.HEADER_CTA} items={ctaItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
