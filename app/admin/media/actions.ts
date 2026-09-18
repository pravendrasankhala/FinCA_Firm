"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";
import { mediaTypeFromMime } from "@/lib/media";
import { cloudinary, parseCloudinaryUrl } from "@/lib/cloudinary";

export async function recordMediaAsset(input: {
  fileName: string;
  url: string;
  contentType: string;
  fileSize: number;
  altText?: string;
}) {
  const user = await requireAdmin();

  const asset = await prisma.mediaAsset.create({
    data: {
      fileName: input.fileName,
      url: input.url,
      type: mediaTypeFromMime(input.contentType),
      fileSize: input.fileSize,
      altText: input.altText,
    },
  });

  await logActivity({ userId: user.id, action: "upload", entity: "MediaAsset", entityId: asset.id });
  revalidatePath("/admin/media");
  return { success: true as const, asset };
}

export async function listMediaAssets() {
  await requireAdmin();
  return prisma.mediaAsset.findMany({ orderBy: { uploadedAt: "desc" } });
}

export async function deleteMediaAsset(id: string) {
  const user = await requireAdmin();
  const asset = await prisma.mediaAsset.delete({ where: { id } });

  try {
    const parsed = parseCloudinaryUrl(asset.url);
    if (parsed) {
      await cloudinary.uploader.destroy(parsed.publicId, { resource_type: parsed.resourceType });
    }
  } catch {
    // Cloudinary asset may already be gone; DB record removal is what matters for the UI.
  }

  await logActivity({ userId: user.id, action: "delete", entity: "MediaAsset", entityId: id });
  revalidatePath("/admin/media");
  return { success: true as const };
}
