import { Request, Response, NextFunction } from "express"
import { UserService } from "../services/user-service"

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await UserService.register(req.body)
            res.status(201).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await UserService.login(req.body)
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.user_id
            const result = await UserService.getUserById(userId)
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.user_id
            const result = await UserService.updateProfile(userId, req.body)
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async deleteAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.user_id
            await UserService.deleteUser(userId)
            res.status(200).json({
                message: "Account deleted successfully"
            })
        } catch (error) {
            next(error)
        }
    }
}