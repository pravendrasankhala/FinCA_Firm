import Link from "next/link";
import { prisma } from "@/lib/db";
import { NavLocation } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationManager } from "@/components/admin/navigation/NavigationManager";

export const dynamic = "force-dynamic";

export default async function FooterAdminPage() {
  const [quickLinks, legalLinks] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { location: NavLocation.FOOTER_QUICK_LINKS },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.navigationItem.findMany({
      where: { location: NavLocation.FOOTER_LEGAL },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Footer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage footer links. Firm info, contact details and social links are managed under{" "}
          <Link href="/admin/settings" className="underline">
            Site Settings
          </Link>
          . The Services column shows your published services automatically.
        </p>
      </div>
      <Tabs defaultValue="quick">
        <TabsList>
          <TabsTrigger value="quick">Quick Links</TabsTrigger>
          <TabsTrigger value="legal">Legal Links</TabsTrigger>
        </TabsList>
        <TabsContent value="quick" className="mt-6">
          <NavigationManager location={NavLocation.FOOTER_QUICK_LINKS} items={quickLinks} />
        </TabsContent>
        <TabsContent value="legal" className="mt-6">
          <NavigationManager location={NavLocation.FOOTER_LEGAL} items={legalLinks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
