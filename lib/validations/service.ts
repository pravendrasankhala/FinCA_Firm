import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(2, "Name is required."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  shortDescription: z.string().min(10, "Short description is required."),
  longDescription: z.string().min(20, "Long description is required."),
  highlights: z.array(z.string().min(1)),
  icon: z.string().optional(),
  imageUrl: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
