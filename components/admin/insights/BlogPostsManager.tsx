"use client";

import Link from "next/link";
import { Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteBlogPost } from "@/app/admin/insights/posts/actions";
import { formatDate } from "@/lib/format";
import type { BlogPost, BlogCategory } from "@prisma/client";

type PostWithCategory = BlogPost & { category: BlogCategory | null };

export function BlogPostsManager({ posts }: { posts: PostWithCategory[] }) {
  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">No blog posts yet.</p>;
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {posts.map((post) => (
        <div key={post.id} className="flex items-center justify-between gap-3 p-4">
          <div className="flex min-w-0 items-center gap-2">
            {post.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-gold-500 text-gold-500" />}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{post.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {post.category?.name ?? "Uncategorized"} · Updated {formatDate(post.updatedAt)}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Badge variant="secondary">{post.status}</Badge>
            <Button asChild variant="ghost" size="icon-sm">
              <Link href={`/admin/insights/posts/${post.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <ConfirmDeleteButton onDelete={() => deleteBlogPost(post.id)} itemLabel="Post" />
          </div>
        </div>
      ))}
    </div>
  );
}
