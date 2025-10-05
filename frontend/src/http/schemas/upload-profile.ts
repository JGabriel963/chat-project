import { z } from "zod";

export const uploadProfileSchema = z.object({
  profilePic: z.string(),
});

export type UploadProfileSchema = z.infer<typeof uploadProfileSchema>;
