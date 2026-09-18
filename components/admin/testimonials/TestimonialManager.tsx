"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Pencil, Star } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { SortableList } from "@/components/admin/SortableList";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations/testimonial";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialPublished,
  reorderTestimonials,
} from "@/app/admin/testimonials/actions";
import type { Testimonial } from "@prisma/client";

export function TestimonialManager({ testimonials }: { testimonials: Testimonial[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

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
          Add Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-sm text-muted-foreground">No testimonials yet.</p>
      ) : (
        <SortableList
          items={testimonials}
          onReorder={reorderTestimonials}
          renderItem={(testimonial) => (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {testimonial.clientName}
                </p>
                <p className="truncate text-xs text-muted-foreground">{testimonial.content}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {!testimonial.published && <Badge variant="secondary">Hidden</Badge>}
                <PublishToggle
                  id={testimonial.id}
                  defaultChecked={testimonial.published}
                  onToggle={toggleTestimonialPublished}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditing(testimonial);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmDeleteButton
                  onDelete={() => deleteTestimonial(testimonial.id)}
                  itemLabel="Testimonial"
                />
              </div>
            </div>
          )}
        />
      )}

      <TestimonialDialog open={open} onOpenChange={setOpen} testimonial={editing} />
    </div>
  );
}

function TestimonialDialog({
  open,
  onOpenChange,
  testimonial,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial | null;
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    values: {
      clientName: testimonial?.clientName ?? "",
      company: testimonial?.company ?? "",
      designation: testimonial?.designation ?? "",
      photoUrl: testimonial?.photoUrl ?? "",
      content: testimonial?.content ?? "",
      rating: testimonial?.rating ?? 5,
      published: testimonial?.published ?? true,
    },
  });

  const onSubmit = async (values: TestimonialInput) => {
    const result = testimonial
      ? await updateTestimonial(testimonial.id, values)
      : await createTestimonial(values);
    if (result.success) {
      toast.success(testimonial ? "Testimonial updated." : "Testimonial added.");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{testimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="t-name">Client Name</Label>
              <Input id="t-name" {...register("clientName")} />
              {errors.clientName && (
                <p className="text-xs text-destructive">{errors.clientName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-company">Company</Label>
              <Input id="t-company" {...register("company")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="t-designation">Designation</Label>
              <Input id="t-designation" {...register("designation")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-photo">Photo URL</Label>
              <Input id="t-photo" {...register("photoUrl")} placeholder="https://..." />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-content">Testimonial</Label>
            <Textarea id="t-content" rows={4} {...register("content")} />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Rating</Label>
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => field.onChange(n)}
                      aria-label={`${n} stars`}
                    >
                      <Star
                        className={cn(
                          "h-5 w-5",
                          n <= field.value ? "fill-gold-500 text-gold-500" : "text-border"
                        )}
                      />
                    </button>
                  ))}
                </div>
              )}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked)}
              id="t-published"
            />
            <Label htmlFor="t-published">Published</Label>
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
