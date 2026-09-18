"use client";

import Image from "next/image";
import { FileText, Video, Check } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteMediaAsset } from "@/app/admin/media/actions";
import { cn } from "@/lib/utils";
import { MediaType, type MediaAsset } from "@prisma/client";

export function MediaGrid({
  assets,
  onSelect,
  onDeleted,
  selectedUrl,
  showDelete = true,
}: {
  assets: MediaAsset[];
  onSelect?: (asset: MediaAsset) => void;
  onDeleted?: (id: string) => void;
  selectedUrl?: string;
  showDelete?: boolean;
}) {
  if (assets.length === 0) {
    return <p className="text-sm text-muted-foreground">No media uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className={cn(
            "group relative overflow-hidden rounded-lg border border-border bg-card",
            onSelect && "cursor-pointer",
            selectedUrl === asset.url && "ring-2 ring-primary"
          )}
          onClick={() => onSelect?.(asset)}
        >
          <div className="flex aspect-square items-center justify-center bg-muted">
            {asset.type === MediaType.IMAGE ? (
              <Image src={asset.url} alt={asset.altText ?? asset.fileName} fill className="object-cover" />
            ) : asset.type === MediaType.VIDEO ? (
              <Video className="h-8 w-8 text-muted-foreground" />
            ) : (
              <FileText className="h-8 w-8 text-muted-foreground" />
            )}
            {selectedUrl === asset.url && (
              <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-1 p-2">
            <p className="truncate text-xs text-foreground">{asset.fileName}</p>
            {showDelete && (
              <div onClick={(e) => e.stopPropagation()}>
                <ConfirmDeleteButton
                  onDelete={async () => {
                    const result = await deleteMediaAsset(asset.id);
                    if (result.success) onDeleted?.(asset.id);
                    return result;
                  }}
                  itemLabel="File"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
