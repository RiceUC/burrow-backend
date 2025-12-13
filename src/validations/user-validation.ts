import { z, ZodType } from "zod"

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(50, "Username must be at most 50 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password must be at most 100 characters"),
        name: z
            .string()
            .min(1, "Name cannot be empty")
            .max(100, "Name must be at most 100 characters"),
        birthdate: z
            .string()
            .datetime()
            .or(z.date()),
        default_sound_duration: z
            .number()
            .int()
            .positive("Sound duration must be positive"),
        reminder_time: z
            .string()
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Reminder time must be in HH:mm format (e.g., 22:00)"),
        gender: z
            .string()
            .min(1, "Gender is required")
            .max(20, "Gender must be at most 20 characters")
    })

    static readonly LOGIN: ZodType = z.object({
        username: z
            .string()
            .min(1, "Username is required"),
        password: z
            .string()
            .min(1, "Password is required"),
    })

    static readonly UPDATE: ZodType = z.object({
        name: z
            .string()
            .min(1, "Name cannot be empty")
            .max(100, "Name must be at most 100 characters")
            .optional(),
        birthdate: z
            .string()
            .datetime()
            .or(z.date())
            .optional(),
        default_sound_duration: z
            .number()
            .int()
            .positive("Sound duration must be positive")
            .optional(),
        reminder_time: z
            .string()
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Reminder time must be in HH:mm format (e.g., 22:00)"),
        gender: z
            .string()
            .max(20, "Gender must be at most 20 characters")
            .optional(),
    })
}