import { prisma } from "@/lib/db";
import { BlogCategoryManager } from "@/components/admin/insights/BlogCategoryManager";

export const dynamic = "force-dynamic";

export default async function BlogCategoriesAdminPage() {
  const categories = await prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Blog Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organize your insights posts into categories.
        </p>
      </div>
      <BlogCategoryManager categories={categories} />
    </div>
  );
}
