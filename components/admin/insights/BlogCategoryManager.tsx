"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SortableList } from "@/components/admin/SortableList";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { blogCategorySchema, type BlogCategoryInput } from "@/lib/validations/blog-category";
import {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  reorderBlogCategories,
} from "@/app/admin/insights/categories/actions";
import { slugify } from "@/lib/slugify";
import type { BlogCategory } from "@prisma/client";

export function BlogCategoryManager({ categories }: { categories: BlogCategory[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogCategory | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Drag to reorder.</p>
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      ) : (
        <SortableList
          items={categories}
          onReorder={reorderBlogCategories}
          renderItem={(category) => (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">{category.name}</p>
              <div className="flex shrink-0 items-center gap-1">
                {!category.published && <Badge variant="secondary">Hidden</Badge>}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditing(category);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmDeleteButton
                  onDelete={() => deleteBlogCategory(category.id)}
                  itemLabel="Category"
                />
              </div>
            </div>
          )}
        />
      )}

      <CategoryDialog open={open} onOpenChange={setOpen} category={editing} />
    </div>
  );
}

function CategoryDialog({
  open,
  onOpenChange,
  category,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: BlogCategory | null;
}) {
  const [slugTouched, setSlugTouched] = useState(!!category?.slug);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogCategoryInput>({
    resolver: zodResolver(blogCategorySchema),
    values: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      published: category?.published ?? true,
    },
  });

  const onSubmit = async (values: BlogCategoryInput) => {
    const result = category
      ? await updateBlogCategory(category.id, values)
      : await createBlogCategory(values);
    if (result.success) {
      toast.success("Saved.");
      onOpenChange(false);
      setSlugTouched(false);
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bc-name">Name</Label>
            <Input
              id="bc-name"
              {...register("name")}
              onChange={(e) => {
                register("name").onChange(e);
                if (!slugTouched) setValue("slug", slugify(e.target.value));
              }}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bc-slug">Slug</Label>
            <Input
              id="bc-slug"
              {...register("slug")}
              onChange={(e) => {
                setSlugTouched(true);
                register("slug").onChange(e);
              }}
            />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked)}
              id="bc-published"
            />
            <Label htmlFor="bc-published">Published</Label>
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
