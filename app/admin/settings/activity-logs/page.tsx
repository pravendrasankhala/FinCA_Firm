import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ActivityLogsPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Activity Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent content changes made from the admin panel.
        </p>
      </div>
      {logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{log.action}</Badge>
                <span className="text-sm text-foreground">{log.entity}</span>
                <span className="text-xs text-muted-foreground">{log.user?.name ?? "System"}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
