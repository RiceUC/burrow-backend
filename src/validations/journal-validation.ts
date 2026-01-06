import { z, ZodType } from "zod"

export class JournalValidation {
    static readonly CREATE: ZodType = z.object({
        user_id: z.number().int().positive("User ID harus positif"),
        content: z.string().min(1, "Content tidak boleh kosong").max(5000, "Content maksimal 5000 karakter"),
        mood: z.enum(['happy', 'sad', 'tired', 'angry'], {
            errorMap: () => ({ message: "Mood harus salah satu dari: happy, sad, tired, angry" })
        })
    })

    static readonly UPDATE: ZodType = z.object({
        content: z.string().min(1, "Content tidak boleh kosong").max(5000, "Content maksimal 5000 karakter").optional(),
        mood: z.enum(['happy', 'sad', 'tired', 'angry'], {
            errorMap: () => ({ message: "Mood harus salah satu dari: happy, sad, tired, angry" })
        }).optional()
    }).strict()
}
