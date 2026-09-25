import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { BlogPostsManager } from "@/components/admin/insights/BlogPostsManager";

export const dynamic = "force-dynamic";

export default async function BlogPostsAdminPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Blog Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Write, schedule and publish articles for the Insights section.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/insights/posts/new">
            <Plus className="h-4 w-4" />
            Add New
          </Link>
        </Button>
      </div>

      <BlogPostsManager posts={posts} />
    </div>
  );
}
