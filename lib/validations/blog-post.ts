import { z } from "zod";
import { PostStatus } from "@prisma/client";

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title is required."),
  slug: z
    .string()
    .min(3, "Slug is required.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  excerpt: z.string().min(10, "Excerpt is required."),
  content: z.string().min(20, "Content is required."),
  featuredImage: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  tags: z.array(z.string()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  status: z.nativeEnum(PostStatus),
  featured: z.boolean(),
  publishedAt: z.string().optional(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
