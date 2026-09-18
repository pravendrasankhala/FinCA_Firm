import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name is required."),
  designation: z.string().min(2, "Designation is required."),
  qualification: z.string().optional(),
  biography: z.string().optional(),
  experience: z.string().optional(),
  photoUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  email: z.string().optional(),
  published: z.boolean(),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
