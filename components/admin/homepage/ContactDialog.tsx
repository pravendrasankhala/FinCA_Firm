"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { contactFormSchema, type ContactFormInput } from "@/lib/validations/page-section";
import { updateSectionContent } from "@/app/admin/homepage/actions";
import type { PageSection } from "@prisma/client";
import type { ContactContent } from "@/lib/types/sections";

export function ContactDialog({
  open,
  onOpenChange,
  section,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: PageSection;
}) {
  const content = (section.content as ContactContent) || {};

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    values: {
      heading: content.heading ?? "",
      description: content.description ?? "",
    },
  });

  const onSubmit = async (values: ContactFormInput) => {
    await updateSectionContent(section.id, { content: values });
    toast.success("Contact section updated.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact Section</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ct-heading">Heading</Label>
            <Input id="ct-heading" {...register("heading")} />
            {errors.heading && <p className="text-xs text-destructive">{errors.heading.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ct-desc">Description</Label>
            <Textarea id="ct-desc" rows={3} {...register("description")} />
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
