"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { seoSettingsSchema, type SeoSettingsInput } from "@/lib/validations/site-settings";
import { updateSeoSettings } from "@/app/admin/settings/actions";

export function SeoSettingsForm({ defaultValues }: { defaultValues: SeoSettingsInput }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SeoSettingsInput>({
    resolver: zodResolver(seoSettingsSchema),
    defaultValues,
  });

  const onSubmit = async (values: SeoSettingsInput) => {
    const result = await updateSeoSettings(values);
    if (result.success) {
      toast.success("SEO settings updated.");
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="metaTitle">Default Meta Title</Label>
        <Input id="metaTitle" {...register("metaTitle")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="metaDescription">Default Meta Description</Label>
        <Textarea id="metaDescription" rows={3} {...register("metaDescription")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ogImageUrl">Default OG Image URL</Label>
        <Input id="ogImageUrl" {...register("ogImageUrl")} placeholder="https://..." />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
