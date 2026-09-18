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
import { faqSchema, type FaqInput } from "@/lib/validations/faq";
import { createFaq, updateFaq, deleteFaq, reorderFaqs } from "@/app/admin/faqs/actions";
import type { Faq } from "@prisma/client";

export function FaqManager({ serviceId, faqs }: { serviceId: string | null; faqs: Faq[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">FAQs</h3>
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
          Add FAQ
        </Button>
      </div>

      {faqs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No FAQs yet.</p>
      ) : (
        <SortableList
          items={faqs}
          onReorder={reorderFaqs}
          renderItem={(faq) => (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{faq.question}</p>
                <p className="truncate text-xs text-muted-foreground">{faq.answer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {!faq.published && <Badge variant="secondary">Hidden</Badge>}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditing(faq);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmDeleteButton onDelete={() => deleteFaq(faq.id)} itemLabel="FAQ" />
              </div>
            </div>
          )}
        />
      )}

      <FaqDialog
        open={open}
        onOpenChange={setOpen}
        serviceId={serviceId}
        faq={editing}
      />
    </div>
  );
}

function FaqDialog({
  open,
  onOpenChange,
  serviceId,
  faq,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string | null;
  faq: Faq | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FaqInput>({
    resolver: zodResolver(faqSchema),
    values: {
      question: faq?.question ?? "",
      answer: faq?.answer ?? "",
      serviceId,
      published: faq?.published ?? true,
    },
  });

  const onSubmit = async (values: FaqInput) => {
    const result = faq ? await updateFaq(faq.id, values) : await createFaq(values);
    if (result.success) {
      toast.success(faq ? "FAQ updated." : "FAQ added.");
      onOpenChange(false);
      reset();
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{faq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="question">Question</Label>
            <Input id="question" {...register("question")} />
            {errors.question && <p className="text-xs text-destructive">{errors.question.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="answer">Answer</Label>
            <Textarea id="answer" rows={4} {...register("answer")} />
            {errors.answer && <p className="text-xs text-destructive">{errors.answer.message}</p>}
          </div>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked)}
              id="faq-published"
            />
            <Label htmlFor="faq-published">Published</Label>
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
