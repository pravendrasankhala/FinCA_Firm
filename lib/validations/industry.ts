import { z } from "zod";

export const industrySchema = z.object({
  name: z.string().min(2, "Name is required."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  description: z.string().min(10, "Description is required."),
  imageUrl: z.string().optional(),
  icon: z.string().optional(),
  published: z.boolean(),
});

export type IndustryInput = z.infer<typeof industrySchema>;
