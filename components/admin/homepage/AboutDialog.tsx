"use client";

import { useForm, Controller } from "react-hook-form";
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
import { MediaUrlField } from "@/components/admin/media/MediaUrlField";
import { aboutFormSchema, type AboutFormInput } from "@/lib/validations/page-section";
import { updateSectionContent } from "@/app/admin/homepage/actions";
import type { PageSection } from "@prisma/client";
import type { AboutContent, AboutMedia } from "@/lib/types/sections";

export function AboutDialog({
  open,
  onOpenChange,
  section,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: PageSection;
}) {
  const content = (section.content as AboutContent) || {};
  const media = (section.media as AboutMedia) || {};

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutFormInput>({
    resolver: zodResolver(aboutFormSchema),
    values: {
      label: content.label ?? "",
      headingLine1: content.headingLine1 ?? "",
      headingLine2: content.headingLine2 ?? "",
      description: content.description ?? "",
      buttonText: content.buttonText ?? "",
      buttonUrl: content.buttonUrl ?? "",
      imageUrl: media.imageUrl ?? "",
    },
  });

  const onSubmit = async (values: AboutFormInput) => {
    const { imageUrl, ...rest } = values;
    await updateSectionContent(section.id, {
      content: rest,
      media: { imageUrl },
    });
    toast.success("About section updated.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit About Section</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="a-label">Section Label</Label>
            <Input id="a-label" {...register("label")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="a-h1">Heading Line 1</Label>
              <Input id="a-h1" {...register("headingLine1")} />
              {errors.headingLine1 && (
                <p className="text-xs text-destructive">{errors.headingLine1.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="a-h2">Heading Line 2</Label>
              <Input id="a-h2" {...register("headingLine2")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="a-desc">Description</Label>
            <Textarea id="a-desc" rows={4} {...register("description")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="a-btn-text">Button Text</Label>
              <Input id="a-btn-text" {...register("buttonText")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="a-btn-url">Button URL</Label>
              <Input id="a-btn-url" {...register("buttonUrl")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="a-image">Image</Label>
            <Controller
              control={control}
              name="imageUrl"
              render={({ field }) => (
                <MediaUrlField value={field.value ?? ""} onChange={field.onChange} />
              )}
            />
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
