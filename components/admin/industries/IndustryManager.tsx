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
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { industrySchema, type IndustryInput } from "@/lib/validations/industry";
import {
  createIndustry,
  updateIndustry,
  deleteIndustry,
  toggleIndustryPublished,
  reorderIndustries,
} from "@/app/admin/industries/actions";
import { ICON_NAMES } from "@/lib/icon-map";
import { DynamicIcon } from "@/components/DynamicIcon";
import { slugify } from "@/lib/slugify";
import type { Industry } from "@prisma/client";

export function IndustryManager({ industries }: { industries: Industry[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Industry | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Drag to reorder.</p>
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      {industries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No industries yet.</p>
      ) : (
        <SortableList
          items={industries}
          onReorder={reorderIndustries}
          renderItem={(industry) => {
            return (
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <DynamicIcon
                    iconName={industry.icon}
                    className="h-4 w-4 shrink-0 text-muted-foreground"
                  />
                  <p className="truncate text-sm font-medium text-foreground">{industry.name}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {!industry.published && <Badge variant="secondary">Hidden</Badge>}
                  <PublishToggle
                    id={industry.id}
                    defaultChecked={industry.published}
                    onToggle={toggleIndustryPublished}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setEditing(industry);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <ConfirmDeleteButton onDelete={() => deleteIndustry(industry.id)} itemLabel="Industry" />
                </div>
              </div>
            );
          }}
        />
      )}

      <IndustryDialog open={open} onOpenChange={setOpen} industry={editing} />
    </div>
  );
}

function IndustryDialog({
  open,
  onOpenChange,
  industry,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  industry: Industry | null;
}) {
  const [slugTouched, setSlugTouched] = useState(!!industry?.slug);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IndustryInput>({
    resolver: zodResolver(industrySchema),
    values: {
      name: industry?.name ?? "",
      slug: industry?.slug ?? "",
      description: industry?.description ?? "",
      imageUrl: industry?.imageUrl ?? "",
      icon: industry?.icon ?? "",
      published: industry?.published ?? true,
    },
  });

  const onSubmit = async (values: IndustryInput) => {
    const result = industry ? await updateIndustry(industry.id, values) : await createIndustry(values);
    if (result.success) {
      toast.success(industry ? "Industry updated." : "Industry added.");
      onOpenChange(false);
      setSlugTouched(false);
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{industry ? "Edit Industry" : "Add Industry"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ind-name">Name</Label>
            <Input
              id="ind-name"
              {...register("name")}
              onChange={(e) => {
                register("name").onChange(e);
                if (!slugTouched) setValue("slug", slugify(e.target.value));
              }}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ind-slug">Slug</Label>
            <Input
              id="ind-slug"
              {...register("slug")}
              onChange={(e) => {
                setSlugTouched(true);
                register("slug").onChange(e);
              }}
            />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ind-description">Description</Label>
            <Textarea id="ind-description" rows={3} {...register("description")} />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ind-icon">Icon</Label>
            <Controller
              control={control}
              name="icon"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="ind-icon" className="w-full">
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
          <div className="space-y-1.5">
            <Label htmlFor="ind-image">Image URL</Label>
            <Input id="ind-image" {...register("imageUrl")} placeholder="https://..." />
          </div>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked)}
              id="ind-published"
            />
            <Label htmlFor="ind-published">Published</Label>
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
