// src/lib/validations.ts
import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(2).max(50),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;