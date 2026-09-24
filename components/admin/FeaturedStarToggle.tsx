"use client";

import { useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function FeaturedStarToggle({
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
    <button
      type="button"
      disabled={isPending}
      aria-pressed={defaultChecked}
      aria-label={defaultChecked ? "Remove from homepage" : "Show on homepage"}
      title={defaultChecked ? "Shown on homepage" : "Show on homepage"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = !defaultChecked;
        startTransition(async () => {
          const result = await onToggle(id, next);
          if (!result.success) {
            toast.error(result.error || "Failed to update.");
          }
        });
      }}
      className="shrink-0 disabled:opacity-50"
    >
      <Star
        className={cn(
          "h-4 w-4 transition-colors",
          defaultChecked
            ? "fill-gold-500 text-gold-500"
            : "fill-none text-muted-foreground hover:text-gold-500"
        )}
      />
    </button>
  );
}
