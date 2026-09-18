import { z } from "zod";

export const clientLogoSchema = z.object({
  name: z.string().min(2, "Company name is required."),
  logoUrl: z.string().min(3, "Logo URL is required."),
  website: z.string().optional(),
  published: z.boolean(),
});

export type ClientLogoInput = z.infer<typeof clientLogoSchema>;
