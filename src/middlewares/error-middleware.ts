import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { ResponseError } from "../error/response-error"

export const errorMiddleware = async (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
        res.status(400).json({
            errors: `Validation error: ${JSON.stringify(error.message)}`,
        })
    } 

    // Handle custom response errors
    else if (error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message,
        })
    } 
    
    // Handle generic errors
    else {
        res.status(500).json({
            errors: error.message,
        })
    }
}