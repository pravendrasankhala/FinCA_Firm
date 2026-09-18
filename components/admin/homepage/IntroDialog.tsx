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
import { introFormSchema, type IntroFormInput } from "@/lib/validations/page-section";
import { updateSectionContent } from "@/app/admin/homepage/actions";
import type { PageSection } from "@prisma/client";
import type { SectionIntroContent } from "@/lib/types/sections";

export function IntroDialog({
  open,
  onOpenChange,
  section,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: PageSection;
  title: string;
}) {
  const content = (section.content as SectionIntroContent) || {};

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IntroFormInput>({
    resolver: zodResolver(introFormSchema),
    values: {
      label: content.label ?? "",
      heading: content.heading ?? "",
      subtitle: content.subtitle ?? "",
    },
  });

  const onSubmit = async (values: IntroFormInput) => {
    await updateSectionContent(section.id, { content: values });
    toast.success("Section updated.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="i-label">Label</Label>
            <Input id="i-label" {...register("label")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="i-heading">Heading</Label>
            <Input id="i-heading" {...register("heading")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="i-subtitle">Subtitle</Label>
            <Textarea id="i-subtitle" rows={3} {...register("subtitle")} />
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
