import { prisma } from "@/lib/db";
import { MediaLibraryClient } from "@/components/admin/media/MediaLibraryClient";

export const dynamic = "force-dynamic";

export default async function MediaLibraryPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { uploadedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Media Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload images, videos, PDFs and logos to reuse across the site.
        </p>
      </div>
      <MediaLibraryClient initialAssets={assets} />
    </div>
  );
}
