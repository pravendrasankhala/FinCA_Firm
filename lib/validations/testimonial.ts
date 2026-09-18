import { z } from "zod";

export const testimonialSchema = z.object({
  clientName: z.string().min(2, "Client name is required."),
  company: z.string().optional(),
  designation: z.string().optional(),
  photoUrl: z.string().optional(),
  content: z.string().min(10, "Testimonial content is required."),
  rating: z.number().min(1).max(5),
  published: z.boolean(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
