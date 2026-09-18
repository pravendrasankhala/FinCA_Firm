import { prisma } from "@/lib/db";
import { TeamManager } from "@/components/admin/team/TeamManager";

export const dynamic = "force-dynamic";

export default async function TeamAdminPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Team members shown in the homepage &quot;Meet the Team&quot; section.
        </p>
      </div>
      <TeamManager members={members} />
    </div>
  );
}
