import { prisma } from "@/lib/db";

export async function logActivity(params: {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
}) {
  await prisma.activityLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
    },
  });
}
