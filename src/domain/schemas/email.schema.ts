import { z } from "zod";

export const sendEmailSchema = z.object({
  to: z.union([
    z.string().email("Invalid email format"),
    z
      .array(z.string().email("Invalid email format"))
      .min(1, "At least one email is required"),
  ]),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject too long"),
  html: z.string().min(1, "HTML content is required"),
  text: z.string().optional(),
  from: z.string().email("Invalid from email format").optional(),
  attachments: z.array(z.any()).optional(),
});

export type SendEmailRequest = z.infer<typeof sendEmailSchema>;
