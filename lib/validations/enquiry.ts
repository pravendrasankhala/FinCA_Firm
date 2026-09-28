import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(6, "Please enter a valid phone number."),
  company: z.string().optional(),
  serviceNeeded: z.string().min(1, "Please select a service."),
  message: z.string().min(10, "Please share a few details about your requirement."),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
