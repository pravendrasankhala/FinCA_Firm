import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { getCurrentUser } from "@/lib/session";
import { getSiteSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, settings] = await Promise.all([getCurrentUser(), getSiteSettings()]);

  if (!user) {
    // proxy.ts already redirects unauthenticated requests; this is a defensive fallback
    // for the /admin/login route itself, which renders its own standalone layout.
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar firmName={settings.firmName} logoUrl={settings.logoUrl} />
      <div className="flex flex-1 flex-col">
        <Topbar userName={user.name ?? user.email ?? "Admin"} />
        <main className="flex-1 bg-secondary/30 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
