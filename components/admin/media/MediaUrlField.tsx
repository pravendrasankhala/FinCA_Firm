"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { MediaPicker } from "@/components/admin/media/MediaPicker";

export function MediaUrlField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "https://..."}
      />
      <Button type="button" variant="outline" size="icon" onClick={() => setOpen(true)}>
        <ImagePlus className="h-4 w-4" />
      </Button>
      <MediaPicker open={open} onOpenChange={setOpen} onSelect={onChange} currentUrl={value} />
    </div>
  );
}
