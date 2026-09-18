"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviceSchema, type ServiceInput } from "@/lib/validations/service";
import { ICON_NAMES } from "@/lib/icon-map";
import { slugify } from "@/lib/slugify";

export function ServiceForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<ServiceInput>;
  onSubmit: (input: ServiceInput) => Promise<{ success: boolean; error?: string } | void>;
}) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(!!defaultValues?.slug);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      slug: "",
      shortDescription: "",
      longDescription: "",
      highlights: [],
      icon: "",
      imageUrl: "",
      featured: false,
      published: false,
      seoTitle: "",
      seoDescription: "",
      ...defaultValues,
    },
  });

  const name = watch("name");

  const submit = async (values: ServiceInput) => {
    const result = await onSubmit(values);
    if (result && !result.success) {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}
            onChange={(e) => {
              register("name").onChange(e);
              if (!slugTouched) setValue("slug", slugify(e.target.value));
            }}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            {...register("slug")}
            onChange={(e) => {
              setSlugTouched(true);
              register("slug").onChange(e);
            }}
          />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          {name && !errors.slug && (
            <p className="text-xs text-muted-foreground">/services/{watch("slug") || "..."}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Textarea id="shortDescription" rows={2} {...register("shortDescription")} />
        {errors.shortDescription && (
          <p className="text-xs text-destructive">{errors.shortDescription.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="longDescription">Long Description</Label>
        <Textarea id="longDescription" rows={6} {...register("longDescription")} />
        {errors.longDescription && (
          <p className="text-xs text-destructive">{errors.longDescription.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="highlights">Highlights</Label>
        <Controller
          control={control}
          name="highlights"
          render={({ field }) => (
            <Textarea
              id="highlights"
              rows={4}
              placeholder={"One highlight per line, e.g.\nOperational & financial risk audits\nCompliance risk analysis"}
              defaultValue={field.value?.join("\n") ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                )
              }
            />
          )}
        />
        <p className="text-xs text-muted-foreground">
          Shown as bullet points on the service card. One per line, up to 3-4 recommended.
        </p>
        {errors.highlights && (
          <p className="text-xs text-destructive">{errors.highlights.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="icon">Icon</Label>
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="icon" className="w-full">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_NAMES.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" {...register("imageUrl")} placeholder="https://..." />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <Controller
            control={control}
            name="featured"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} id="featured" />
            )}
          />
          <Label htmlFor="featured">Featured</Label>
        </div>
        <div className="flex items-center gap-2.5">
          <Controller
            control={control}
            name="published"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} id="published" />
            )}
          />
          <Label htmlFor="published">Published</Label>
        </div>
      </div>

      <div className="rounded-lg border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground">SEO</h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input id="seoTitle" {...register("seoTitle")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Service
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/services")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
