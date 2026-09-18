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
import { RichTextEditor } from "@/components/admin/insights/RichTextEditor";
import { MediaUrlField } from "@/components/admin/media/MediaUrlField";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations/blog-post";
import { slugify } from "@/lib/slugify";
import { PostStatus, type BlogCategory } from "@prisma/client";

export function BlogPostForm({
  categories,
  defaultValues,
  onSubmit,
}: {
  categories: BlogCategory[];
  defaultValues?: Partial<BlogPostInput>;
  onSubmit: (input: BlogPostInput) => Promise<{ success: boolean; error?: string } | void>;
}) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(!!defaultValues?.slug);
  const [tagsText, setTagsText] = useState((defaultValues?.tags ?? []).join(", "));

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      categoryId: null,
      tags: [],
      seoTitle: "",
      seoDescription: "",
      ogImage: "",
      canonicalUrl: "",
      status: PostStatus.DRAFT,
      featured: false,
      publishedAt: "",
      ...defaultValues,
    },
  });

  const status = watch("status");

  const submit = async (values: BlogPostInput) => {
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const result = await onSubmit({ ...values, tags });
    if (result && !result.success) {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title")}
            onChange={(e) => {
              register("title").onChange(e);
              if (!slugTouched) setValue("slug", slugify(e.target.value));
            }}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
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
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" rows={2} {...register("excerpt")} />
        {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Content</Label>
        <Controller
          control={control}
          name="content"
          render={({ field }) => <RichTextEditor content={field.value} onChange={field.onChange} />}
        />
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Featured Image</Label>
          <Controller
            control={control}
            name="featuredImage"
            render={({ field }) => (
              <MediaUrlField value={field.value ?? ""} onChange={field.onChange} />
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                <SelectTrigger id="categoryId" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PostStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={PostStatus.PUBLISHED}>Published</SelectItem>
                  <SelectItem value={PostStatus.SCHEDULED}>Scheduled</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {(status === PostStatus.PUBLISHED || status === PostStatus.SCHEDULED) && (
          <div className="space-y-1.5">
            <Label htmlFor="publishedAt">
              {status === PostStatus.SCHEDULED ? "Publish Date" : "Published Date"}
            </Label>
            <Input id="publishedAt" type="datetime-local" {...register("publishedAt")} />
          </div>
        )}
        <div className="flex items-center gap-2.5 pt-6">
          <Controller
            control={control}
            name="featured"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} id="featured" />
            )}
          />
          <Label htmlFor="featured">Featured</Label>
        </div>
      </div>

      <div className="rounded-lg border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground">SEO</h3>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input id="seoTitle" {...register("seoTitle")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input id="canonicalUrl" {...register("canonicalUrl")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
          </div>
          <div className="space-y-1.5">
            <Label>OG Image</Label>
            <Controller
              control={control}
              name="ogImage"
              render={({ field }) => (
                <MediaUrlField value={field.value ?? ""} onChange={field.onChange} />
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Post
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/insights/posts")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
