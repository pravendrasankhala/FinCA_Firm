"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUrlField } from "@/components/admin/media/MediaUrlField";
import { toast } from "sonner";
import {
  generalSettingsSchema,
  type GeneralSettingsInput,
} from "@/lib/validations/site-settings";
import { updateGeneralSettings } from "@/app/admin/settings/actions";

export function GeneralSettingsForm({ defaultValues }: { defaultValues: GeneralSettingsInput }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GeneralSettingsInput>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues,
  });

  const onSubmit = async (values: GeneralSettingsInput) => {
    const result = await updateGeneralSettings(values);
    if (result.success) {
      toast.success("Site settings updated.");
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="firmName">Firm Name</Label>
          <Input id="firmName" {...register("firmName")} />
          {errors.firmName && <p className="text-xs text-destructive">{errors.firmName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" {...register("tagline")} />
          {errors.tagline && <p className="text-xs text-destructive">{errors.tagline.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label>Logo</Label>
          <Controller
            control={control}
            name="logoUrl"
            render={({ field }) => (
              <MediaUrlField value={field.value ?? ""} onChange={field.onChange} />
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Favicon</Label>
          <Controller
            control={control}
            name="faviconUrl"
            render={({ field }) => (
              <MediaUrlField value={field.value ?? ""} onChange={field.onChange} />
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" rows={2} {...register("address")} />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="whatsapp">WhatsApp Number</Label>
          <Input id="whatsapp" {...register("whatsapp")} placeholder="+91XXXXXXXXXX" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="businessHours">Business Hours</Label>
          <Input id="businessHours" {...register("businessHours")} placeholder="Mon–Sat, 10am–7pm" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="copyrightText">Copyright Text</Label>
        <Input id="copyrightText" {...register("copyrightText")} placeholder="© 2026 Aurevia & Co." />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="googleMapsEmbed">Google Maps Embed URL</Label>
        <Input id="googleMapsEmbed" {...register("googleMapsEmbed")} placeholder="https://www.google.com/maps/embed?..." />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
