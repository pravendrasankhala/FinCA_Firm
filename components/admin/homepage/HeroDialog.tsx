"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { MediaUrlField } from "@/components/admin/media/MediaUrlField";
import { heroFormSchema, type HeroFormInput } from "@/lib/validations/page-section";
import { updateSectionContent } from "@/app/admin/homepage/actions";
import type { PageSection } from "@prisma/client";
import type { HeroContent, HeroMedia } from "@/lib/types/sections";

export function HeroDialog({
  open,
  onOpenChange,
  section,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: PageSection;
}) {
  const content = (section.content as HeroContent) || {};
  const media = (section.media as HeroMedia) || {};

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormInput>({
    resolver: zodResolver(heroFormSchema),
    values: {
      eyebrow: content.eyebrow ?? "",
      titleLine1: content.titleLine1 ?? "",
      titleLine2: content.titleLine2 ?? "",
      subtitle: content.subtitle ?? "",
      primaryCtaText: content.primaryCtaText ?? "",
      primaryCtaLink: content.primaryCtaLink ?? "",
      secondaryCtaText: content.secondaryCtaText ?? "",
      secondaryCtaLink: content.secondaryCtaLink ?? "",
      overlayOpacity: content.overlayOpacity ?? 0.55,
      alignment: content.alignment ?? "left",
      videoUrl: media.videoUrl ?? "",
      posterUrl: media.posterUrl ?? "",
    },
  });

  const onSubmit = async (values: HeroFormInput) => {
    const { videoUrl, posterUrl, ...rest } = values;
    await updateSectionContent(section.id, {
      content: rest,
      media: { videoUrl, posterUrl },
    });
    toast.success("Hero updated.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Hero</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="h-eyebrow">Eyebrow</Label>
            <Input id="h-eyebrow" {...register("eyebrow")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="h-title1">Title Line 1</Label>
              <Input id="h-title1" {...register("titleLine1")} />
              {errors.titleLine1 && (
                <p className="text-xs text-destructive">{errors.titleLine1.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="h-title2">Title Line 2</Label>
              <Input id="h-title2" {...register("titleLine2")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="h-subtitle">Subtitle</Label>
            <Textarea id="h-subtitle" rows={3} {...register("subtitle")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="h-cta1-text">Primary CTA Text</Label>
              <Input id="h-cta1-text" {...register("primaryCtaText")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="h-cta1-link">Primary CTA Link</Label>
              <Input id="h-cta1-link" {...register("primaryCtaLink")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="h-cta2-text">Secondary CTA Text</Label>
              <Input id="h-cta2-text" {...register("secondaryCtaText")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="h-cta2-link">Secondary CTA Link</Label>
              <Input id="h-cta2-link" {...register("secondaryCtaLink")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="h-video">Background Video</Label>
              <Controller
                control={control}
                name="videoUrl"
                render={({ field }) => (
                  <MediaUrlField value={field.value ?? ""} onChange={field.onChange} />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="h-poster">Poster Image</Label>
              <Controller
                control={control}
                name="posterUrl"
                render={({ field }) => (
                  <MediaUrlField value={field.value ?? ""} onChange={field.onChange} />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="h-overlay">Overlay Opacity (0–1)</Label>
              <Input
                id="h-overlay"
                type="number"
                step="0.05"
                min={0}
                max={1}
                {...register("overlayOpacity", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="h-align">Alignment</Label>
              <Controller
                control={control}
                name="alignment"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="h-align" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
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
