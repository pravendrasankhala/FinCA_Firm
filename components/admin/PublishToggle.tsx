"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function PublishToggle({
  id,
  defaultChecked,
  onToggle,
}: {
  id: string;
  defaultChecked: boolean;
  onToggle: (id: string, next: boolean) => Promise<{ success: boolean; error?: string }>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      defaultChecked={defaultChecked}
      disabled={isPending}
      onCheckedChange={(checked) => {
        startTransition(async () => {
          const result = await onToggle(id, checked);
          if (!result.success) {
            toast.error(result.error || "Failed to update.");
          }
        });
      }}
    />
  );
}
