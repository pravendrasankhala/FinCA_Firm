"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MediaUploader } from "@/components/admin/media/MediaUploader";
import { MediaGrid } from "@/components/admin/media/MediaGrid";
import { listMediaAssets } from "@/app/admin/media/actions";
import type { MediaAsset } from "@prisma/client";

export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  currentUrl,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
}) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState<string | undefined>(currentUrl);

  useEffect(() => {
    if (!open) return;

    async function load() {
      setLoading(true);
      try {
        const data = await listMediaAssets();
        setAssets(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

        <MediaUploader
          onUploaded={(asset) => {
            setAssets((prev) => [asset, ...prev]);
            setPicked(asset.url);
          }}
        />

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <MediaGrid
            assets={assets}
            selectedUrl={picked}
            onSelect={(asset) => setPicked(asset.url)}
            showDelete={false}
          />
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!picked}
            onClick={() => {
              if (picked) onSelect(picked);
              onOpenChange(false);
            }}
          >
            Use Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
