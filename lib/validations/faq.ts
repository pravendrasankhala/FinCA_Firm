import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().min(3, "Question is required."),
  answer: z.string().min(3, "Answer is required."),
  serviceId: z.string().nullable().optional(),
  published: z.boolean(),
});

export type FaqInput = z.infer<typeof faqSchema>;
