"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { processStepSchema, type ProcessStepInput } from "@/lib/validations/homepage-lists";
import {
  createProcessStep,
  updateProcessStep,
  deleteProcessStep,
  reorderProcessSteps,
} from "@/app/admin/homepage/actions";
import type { ProcessStep } from "@prisma/client";

export function ProcessStepManager({ steps }: { steps: ProcessStep[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProcessStep | null>(null);

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
          Add Step
        </Button>
      </div>

      {steps.length === 0 ? (
        <p className="text-sm text-muted-foreground">No steps yet.</p>
      ) : (
        <SortableList
          items={steps}
          onReorder={reorderProcessSteps}
          renderItem={(step) => (
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-medium text-foreground">
                {step.number} — {step.title}
              </p>
              <div className="flex shrink-0 items-center gap-1">
                {!step.published && <Badge variant="secondary">Hidden</Badge>}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditing(step);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmDeleteButton onDelete={() => deleteProcessStep(step.id)} itemLabel="Step" />
              </div>
            </div>
          )}
        />
      )}

      <StepDialog open={open} onOpenChange={setOpen} step={editing} />
    </div>
  );
}

function StepDialog({
  open,
  onOpenChange,
  step,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: ProcessStep | null;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<ProcessStepInput>({
    resolver: zodResolver(processStepSchema),
    values: {
      number: step?.number ?? "",
      title: step?.title ?? "",
      description: step?.description ?? "",
      icon: step?.icon ?? "",
      published: step?.published ?? true,
    },
  });

  const onSubmit = async (values: ProcessStepInput) => {
    const result = step ? await updateProcessStep(step.id, values) : await createProcessStep(values);
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
          <DialogTitle>{step ? "Edit Step" : "Add Step"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-number">Number</Label>
              <Input id="p-number" {...register("number")} placeholder="01" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="p-title">Title</Label>
              <Input id="p-title" {...register("title")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-desc">Description</Label>
            <Textarea id="p-desc" rows={3} {...register("description")} />
          </div>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked)}
              id="p-published"
            />
            <Label htmlFor="p-published">Published</Label>
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
