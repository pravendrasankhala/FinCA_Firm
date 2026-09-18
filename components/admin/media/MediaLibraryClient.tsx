"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/admin/media/MediaUploader";
import { MediaGrid } from "@/components/admin/media/MediaGrid";
import type { MediaAsset } from "@prisma/client";

export function MediaLibraryClient({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);

  return (
    <div className="space-y-6">
      <MediaUploader onUploaded={(asset) => setAssets((prev) => [asset, ...prev])} />
      <MediaGrid
        assets={assets}
        onDeleted={(id) => setAssets((prev) => prev.filter((a) => a.id !== id))}
      />
    </div>
  );
}
