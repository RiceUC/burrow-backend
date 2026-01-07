import { z, ZodType } from "zod"

export class SoundValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(1, "Title is required").max(100),
        category: z.enum(['about_to_sleep', 'while_sleeping'], {
            errorMap: () => ({ message: "Category must be 'about_to_sleep' or 'while_sleeping'" })
        }),
        duration: z.number().int().positive("Duration must be positive"),
        file_path: z.string().min(1, "File path is required"),
        thumbnail_path: z.string().optional()
    })

    static readonly UPDATE: ZodType = z.object({
        title: z.string().min(1).max(100).optional(),
        category: z.enum(['about_to_sleep', 'while_sleeping']).optional(),
        duration: z.number().int().positive().optional(),
        thumbnail_path: z.string().optional()
    })
}