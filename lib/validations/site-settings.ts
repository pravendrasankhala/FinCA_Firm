import { z } from "zod";

export const generalSettingsSchema = z.object({
  firmName: z.string().min(1, "Firm name is required."),
  tagline: z.string().min(1, "Tagline is required."),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  whatsapp: z.string().optional(),
  businessHours: z.string().optional(),
  copyrightText: z.string().optional(),
  googleMapsEmbed: z.string().optional(),
});
export type GeneralSettingsInput = z.infer<typeof generalSettingsSchema>;

export const seoSettingsSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
});
export type SeoSettingsInput = z.infer<typeof seoSettingsSchema>;

export const socialLinksSchema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
});
export type SocialLinksInput = z.infer<typeof socialLinksSchema>;
