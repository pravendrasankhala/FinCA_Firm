import { prisma } from "@/lib/db";
import { ClientLogoManager } from "@/components/admin/client-logos/ClientLogoManager";

export const dynamic = "force-dynamic";

export default async function ClientLogosAdminPage() {
  const logos = await prisma.clientLogo.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Client Logos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Shown in the homepage logo marquee. Hidden entirely when empty.
        </p>
      </div>
      <ClientLogoManager logos={logos} />
    </div>
  );
}
