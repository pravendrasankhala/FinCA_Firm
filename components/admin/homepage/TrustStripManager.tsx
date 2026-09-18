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
import {
  trustStripItemSchema,
  type TrustStripItemInput,
} from "@/lib/validations/homepage-lists";
import {
  createTrustItem,
  updateTrustItem,
  deleteTrustItem,
  reorderTrustItems,
} from "@/app/admin/homepage/actions";
import type { TrustStripItem } from "@prisma/client";

export function TrustStripManager({ items }: { items: TrustStripItem[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TrustStripItem | null>(null);

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
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No trust strip items yet.</p>
      ) : (
        <SortableList
          items={items}
          onReorder={reorderTrustItems}
          renderItem={(item) => (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
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
                <ConfirmDeleteButton onDelete={() => deleteTrustItem(item.id)} itemLabel="Item" />
              </div>
            </div>
          )}
        />
      )}

      <TrustDialog open={open} onOpenChange={setOpen} item={editing} />
    </div>
  );
}

function TrustDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TrustStripItem | null;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<TrustStripItemInput>({
    resolver: zodResolver(trustStripItemSchema),
    values: { label: item?.label ?? "", icon: item?.icon ?? "", published: item?.published ?? true },
  });

  const onSubmit = async (values: TrustStripItemInput) => {
    const result = item ? await updateTrustItem(item.id, values) : await createTrustItem(values);
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
          <DialogTitle>{item ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ts-label">Label</Label>
            <Input id="ts-label" {...register("label")} />
          </div>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked)}
              id="ts-published"
            />
            <Label htmlFor="ts-published">Published</Label>
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
