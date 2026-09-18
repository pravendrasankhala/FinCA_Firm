"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { statisticSchema, type StatisticInput } from "@/lib/validations/homepage-lists";
import {
  createStatistic,
  updateStatistic,
  deleteStatistic,
  reorderStatistics,
} from "@/app/admin/homepage/actions";
import type { Statistic } from "@prisma/client";

export function StatisticManager({ stats }: { stats: Statistic[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Statistic | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Only add statistics you can stand behind — this section is hidden entirely when empty.
      </p>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Drag to reorder.</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Statistic
        </Button>
      </div>

      {stats.length === 0 ? (
        <p className="text-sm text-muted-foreground">No statistics yet.</p>
      ) : (
        <SortableList
          items={stats}
          onReorder={reorderStatistics}
          renderItem={(stat) => (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">
                {stat.prefix}
                {stat.value}
                {stat.suffix} — {stat.label}
              </p>
              <div className="flex shrink-0 items-center gap-1">
                {!stat.published && <Badge variant="secondary">Hidden</Badge>}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditing(stat);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmDeleteButton onDelete={() => deleteStatistic(stat.id)} itemLabel="Statistic" />
              </div>
            </div>
          )}
        />
      )}

      <StatDialog open={open} onOpenChange={setOpen} stat={editing} />
    </div>
  );
}

function StatDialog({
  open,
  onOpenChange,
  stat,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stat: Statistic | null;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<StatisticInput>({
    resolver: zodResolver(statisticSchema),
    values: {
      label: stat?.label ?? "",
      value: stat?.value ?? "",
      prefix: stat?.prefix ?? "",
      suffix: stat?.suffix ?? "",
      published: stat?.published ?? true,
    },
  });

  const onSubmit = async (values: StatisticInput) => {
    const result = stat ? await updateStatistic(stat.id, values) : await createStatistic(values);
    if (result.success) {
      toast.success("Saved.");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stat ? "Edit Statistic" : "Add Statistic"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="s-label">Label</Label>
            <Input id="s-label" {...register("label")} placeholder="Years of Experience" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-prefix">Prefix</Label>
              <Input id="s-prefix" {...register("prefix")} placeholder="+" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-value">Value</Label>
              <Input id="s-value" {...register("value")} placeholder="12" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-suffix">Suffix</Label>
              <Input id="s-suffix" {...register("suffix")} placeholder="+" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked)}
              id="s-published"
            />
            <Label htmlFor="s-published">Published</Label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
