import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This site currently uses a single admin account. Multi-user roles and invitations can be
          added here later.
        </p>
      </div>
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="secondary">{user.role}</Badge>
              Joined {formatDate(user.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
