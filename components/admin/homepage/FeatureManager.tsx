"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  whyChooseUsFeatureSchema,
  type WhyChooseUsFeatureInput,
} from "@/lib/validations/homepage-lists";
import { createFeature, updateFeature, deleteFeature, reorderFeatures } from "@/app/admin/homepage/actions";
import { ICON_NAMES } from "@/lib/icon-map";
import type { WhyChooseUsFeature } from "@prisma/client";

export function FeatureManager({ features }: { features: WhyChooseUsFeature[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<WhyChooseUsFeature | null>(null);

  return (
    <div className="space-y-4">
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
          Add Feature
        </Button>
      </div>

      {features.length === 0 ? (
        <p className="text-sm text-muted-foreground">No features yet.</p>
      ) : (
        <SortableList
          items={features}
          onReorder={reorderFeatures}
          renderItem={(feature) => (
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-medium text-foreground">{feature.title}</p>
              <div className="flex shrink-0 items-center gap-1">
                {!feature.published && <Badge variant="secondary">Hidden</Badge>}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditing(feature);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmDeleteButton onDelete={() => deleteFeature(feature.id)} itemLabel="Feature" />
              </div>
            </div>
          )}
        />
      )}

      <FeatureDialog open={open} onOpenChange={setOpen} feature={editing} />
    </div>
  );
}

function FeatureDialog({
  open,
  onOpenChange,
  feature,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: WhyChooseUsFeature | null;
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<WhyChooseUsFeatureInput>({
    resolver: zodResolver(whyChooseUsFeatureSchema),
    values: {
      title: feature?.title ?? "",
      description: feature?.description ?? "",
      icon: feature?.icon ?? "",
      published: feature?.published ?? true,
    },
  });

  const onSubmit = async (values: WhyChooseUsFeatureInput) => {
    const result = feature ? await updateFeature(feature.id, values) : await createFeature(values);
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
          <DialogTitle>{feature ? "Edit Feature" : "Add Feature"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="f-title">Title</Label>
            <Input id="f-title" {...register("title")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-desc">Description</Label>
            <Textarea id="f-desc" rows={3} {...register("description")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-icon">Icon</Label>
            <Controller
              control={control}
              name="icon"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="f-icon" className="w-full">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_NAMES.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked)}
              id="f-published"
            />
            <Label htmlFor="f-published">Published</Label>
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
