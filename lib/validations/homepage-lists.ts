import { z } from "zod";

export const trustStripItemSchema = z.object({
  label: z.string().min(2, "Label is required."),
  icon: z.string().optional(),
  published: z.boolean(),
});
export type TrustStripItemInput = z.infer<typeof trustStripItemSchema>;

export const whyChooseUsFeatureSchema = z.object({
  title: z.string().min(2, "Title is required."),
  description: z.string().min(5, "Description is required."),
  icon: z.string().optional(),
  published: z.boolean(),
});
export type WhyChooseUsFeatureInput = z.infer<typeof whyChooseUsFeatureSchema>;

export const processStepSchema = z.object({
  number: z.string().min(1, "Number is required."),
  title: z.string().min(2, "Title is required."),
  description: z.string().min(5, "Description is required."),
  icon: z.string().optional(),
  published: z.boolean(),
});
export type ProcessStepInput = z.infer<typeof processStepSchema>;

export const statisticSchema = z.object({
  label: z.string().min(2, "Label is required."),
  value: z.string().min(1, "Value is required."),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  published: z.boolean(),
});
export type StatisticInput = z.infer<typeof statisticSchema>;
