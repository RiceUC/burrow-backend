import { Request, Response, NextFunction } from "express"
import { SleepService } from "../services/sleep-service"

export class SleepController {
    // Start sleep session
    static async startSession(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.user_id
            const result = await SleepService.startSession(userId, req.body)
            res.status(201).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    // End sleep session
    static async endSession(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.user_id
            const sessionId = parseInt(req.params.sessionId)
            const result = await SleepService.endSession(userId, sessionId, req.body)
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    // Get all sleep sessions for user
    static async getUserSessions(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.user_id
            const result = await SleepService.getUserSessions(userId)
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    // Get sleep statistics
    static async getStatistics(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.user_id
            const result = await SleepService.getStatistics(userId)
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    // Get specific session
    static async getSession(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.user_id
            const sessionId = parseInt(req.params.sessionId)
            const result = await SleepService.getSession(userId, sessionId)
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    // Delete session
    static async deleteSession(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.user_id
            const sessionId = parseInt(req.params.sessionId)
            await SleepService.deleteSession(userId, sessionId)
            res.status(200).json({
                message: "Sleep session deleted successfully"
            })
        } catch (error) {
            next(error)
        }
    }
}