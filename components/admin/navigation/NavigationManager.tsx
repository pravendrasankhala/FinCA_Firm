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
import { navigationItemSchema, type NavigationItemInput } from "@/lib/validations/navigation";
import {
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  reorderNavigationItems,
} from "@/app/admin/navigation/actions";
import type { NavigationItem, NavLocation } from "@prisma/client";

export function NavigationManager({
  location,
  items,
}: {
  location: NavLocation;
  items: NavigationItem[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NavigationItem | null>(null);

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
          Add Link
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No links yet.</p>
      ) : (
        <SortableList
          items={items}
          onReorder={reorderNavigationItems}
          renderItem={(item) => (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{item.label}</p>
                <p className="truncate text-xs text-muted-foreground">{item.url}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {!item.published && <Badge variant="secondary">Hidden</Badge>}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditing(item);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmDeleteButton onDelete={() => deleteNavigationItem(item.id)} itemLabel="Link" />
              </div>
            </div>
          )}
        />
      )}

      <NavDialog open={open} onOpenChange={setOpen} location={location} item={editing} />
    </div>
  );
}

function NavDialog({
  open,
  onOpenChange,
  location,
  item,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: NavLocation;
  item: NavigationItem | null;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NavigationItemInput>({
    resolver: zodResolver(navigationItemSchema),
    values: {
      label: item?.label ?? "",
      url: item?.url ?? "",
      published: item?.published ?? true,
    },
  });

  const onSubmit = async (values: NavigationItemInput) => {
    const result = item
      ? await updateNavigationItem(item.id, values)
      : await createNavigationItem(location, values);
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
          <DialogTitle>{item ? "Edit Link" : "Add Link"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="n-label">Label</Label>
            <Input id="n-label" {...register("label")} />
            {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="n-url">URL</Label>
            <Input id="n-url" {...register("url")} placeholder="/about" />
            {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
          </div>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked)}
              id="n-published"
            />
            <Label htmlFor="n-published">Published</Label>
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
