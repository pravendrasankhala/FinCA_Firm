"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { socialLinksSchema, type SocialLinksInput } from "@/lib/validations/site-settings";
import { updateSocialLinks } from "@/app/admin/settings/actions";

export function SocialLinksForm({ defaultValues }: { defaultValues: SocialLinksInput }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SocialLinksInput>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues,
  });

  const onSubmit = async (values: SocialLinksInput) => {
    const result = await updateSocialLinks(values);
    if (result.success) {
      toast.success("Social links updated.");
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input id="linkedin" {...register("linkedin")} placeholder="https://linkedin.com/company/..." />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="facebook">Facebook</Label>
        <Input id="facebook" {...register("facebook")} placeholder="https://facebook.com/..." />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="instagram">Instagram</Label>
        <Input id="instagram" {...register("instagram")} placeholder="https://instagram.com/..." />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="twitter">Twitter / X</Label>
        <Input id="twitter" {...register("twitter")} placeholder="https://x.com/..." />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="youtube">YouTube</Label>
        <Input id="youtube" {...register("youtube")} placeholder="https://youtube.com/..." />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
