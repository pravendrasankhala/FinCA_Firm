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
import { ctaFormSchema, type CtaFormInput } from "@/lib/validations/page-section";
import { updateSectionContent } from "@/app/admin/homepage/actions";
import type { PageSection } from "@prisma/client";
import type { CtaContent } from "@/lib/types/sections";

export function CtaDialog({
  open,
  onOpenChange,
  section,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: PageSection;
}) {
  const content = (section.content as CtaContent) || {};

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CtaFormInput>({
    resolver: zodResolver(ctaFormSchema),
    values: {
      heading: content.heading ?? "",
      description: content.description ?? "",
      primaryCtaText: content.primaryCtaText ?? "",
      primaryCtaLink: content.primaryCtaLink ?? "",
      secondaryCtaText: content.secondaryCtaText ?? "",
      secondaryCtaLink: content.secondaryCtaLink ?? "",
      whatsappNumber: content.whatsappNumber ?? "",
    },
  });

  const onSubmit = async (values: CtaFormInput) => {
    await updateSectionContent(section.id, { content: values });
    toast.success("CTA updated.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit CTA Section</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="c-heading">Heading</Label>
            <Input id="c-heading" {...register("heading")} />
            {errors.heading && <p className="text-xs text-destructive">{errors.heading.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-desc">Description</Label>
            <Textarea id="c-desc" rows={3} {...register("description")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="c-cta1-text">Primary CTA Text</Label>
              <Input id="c-cta1-text" {...register("primaryCtaText")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-cta1-link">Primary CTA Link</Label>
              <Input id="c-cta1-link" {...register("primaryCtaLink")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="c-cta2-text">Secondary CTA Text</Label>
              <Input id="c-cta2-text" {...register("secondaryCtaText")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-cta2-link">Secondary CTA Link</Label>
              <Input id="c-cta2-link" {...register("secondaryCtaLink")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-whatsapp">WhatsApp Number</Label>
            <Input id="c-whatsapp" {...register("whatsappNumber")} placeholder="+91XXXXXXXXXX" />
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
