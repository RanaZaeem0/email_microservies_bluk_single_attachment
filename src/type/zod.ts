// src/models/email.ts
import { z } from "zod";

export const EmailSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).optional(),
    subject: z.string().optional().default("No Subject"),
    body: z.string().optional().default(""),
    html: z.string().optional(),
    from: z.string().optional(),
    priority: z.number().min(1).max(5).optional().default(3), // 1=highest, 5=lowest
    delay: z.number().optional().default(0),
    attachments: z.array(
        z.object({
            filename: z.string(),
            content: z.string(),
            contentType: z.string().optional()
        })
    ).optional()
});

export type EmailData = z.infer<typeof EmailSchema>;