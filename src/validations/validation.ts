import { ZodType } from "zod"

export class Validation {
    static validate<T>(schema: ZodType, data: T): T {
        // Parse and validate data against schema
        // Throws ZodError if validation fails
        return schema.parse(data) as T
    }
}