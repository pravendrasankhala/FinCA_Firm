import { z } from "zod";

export const navigationItemSchema = z.object({
  label: z.string().min(1, "Label is required."),
  url: z.string().min(1, "URL is required."),
  published: z.boolean(),
});

export type NavigationItemInput = z.infer<typeof navigationItemSchema>;
