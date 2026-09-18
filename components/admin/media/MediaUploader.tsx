"use client";

import { useRef, useState } from "react";
import { Loader2, Upload as UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { recordMediaAsset } from "@/app/admin/media/actions";
import type { MediaAsset } from "@prisma/client";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPE_PREFIXES = ["image/", "video/", "application/pdf"];

export function MediaUploader({ onUploaded }: { onUploaded: (asset: MediaAsset) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!ALLOWED_TYPE_PREFIXES.some((prefix) => file.type.startsWith(prefix))) {
      toast.error("Unsupported file type.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large (max 500MB).");
      return;
    }

    setIsUploading(true);
    try {
      const signResponse = await fetch("/api/media/upload", { method: "POST" });
      if (!signResponse.ok) {
        const body = await signResponse.json().catch(() => null);
        throw new Error(body?.error || "Failed to authorize upload.");
      }
      const { cloudName, apiKey, timestamp, signature, folder } = await signResponse.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult?.error?.message || "Upload to Cloudinary failed.");
      }

      const result = await recordMediaAsset({
        fileName: file.name,
        url: uploadResult.secure_url,
        contentType: file.type,
        fileSize: file.size,
      });

      if (result.success) {
        toast.success("File uploaded.");
        onUploaded(result.asset);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <Button type="button" variant="outline" disabled={isUploading} onClick={() => inputRef.current?.click()}>
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
        {isUploading ? "Uploading..." : "Upload File"}
      </Button>
    </div>
  );
}
