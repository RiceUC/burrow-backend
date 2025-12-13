import { z, ZodType } from "zod"

export class SleepValidation {
    static readonly START: ZodType = z.object({
        start_time: z
            .string()
            .datetime()
            .or(z.date())
    })

    static readonly END: ZodType = z.object({
        end_time: z
            .string()
            .datetime()
            .or(z.date()),
        sleep_quality: z
            .number()
            .int()
            .min(1, "Sleep quality must be between 1-5")
            .max(5, "Sleep quality must be between 1-5")
            .optional()
    })
}