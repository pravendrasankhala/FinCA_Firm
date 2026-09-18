import { z } from "zod";

export const heroFormSchema = z.object({
  eyebrow: z.string().optional(),
  titleLine1: z.string().min(1, "Title is required."),
  titleLine2: z.string().optional(),
  subtitle: z.string().optional(),
  primaryCtaText: z.string().optional(),
  primaryCtaLink: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  overlayOpacity: z.number().min(0).max(1),
  alignment: z.enum(["left", "center"]),
  videoUrl: z.string().optional(),
  posterUrl: z.string().optional(),
});
export type HeroFormInput = z.infer<typeof heroFormSchema>;

export const aboutFormSchema = z.object({
  label: z.string().optional(),
  headingLine1: z.string().min(1, "Heading is required."),
  headingLine2: z.string().optional(),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  imageUrl: z.string().optional(),
});
export type AboutFormInput = z.infer<typeof aboutFormSchema>;

export const introFormSchema = z.object({
  label: z.string().optional(),
  heading: z.string().optional(),
  subtitle: z.string().optional(),
});
export type IntroFormInput = z.infer<typeof introFormSchema>;

export const ctaFormSchema = z.object({
  heading: z.string().min(1, "Heading is required."),
  description: z.string().optional(),
  primaryCtaText: z.string().optional(),
  primaryCtaLink: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  whatsappNumber: z.string().optional(),
});
export type CtaFormInput = z.infer<typeof ctaFormSchema>;

export const contactFormSchema = z.object({
  heading: z.string().min(1, "Heading is required."),
  description: z.string().optional(),
});
export type ContactFormInput = z.infer<typeof contactFormSchema>;
