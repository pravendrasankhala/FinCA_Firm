import { z } from "zod";

export const blogCategorySchema = z.object({
  name: z.string().min(2, "Name is required."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  published: z.boolean(),
});

export type BlogCategoryInput = z.infer<typeof blogCategorySchema>;
