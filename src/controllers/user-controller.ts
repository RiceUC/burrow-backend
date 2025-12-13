import { Request, Response, NextFunction } from "express"
import { UserService } from "../services/user-service"
import { generateToken } from "../utils/jwt-util"

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
            const token = generateToken({
                user_id: result.user_id,
                username: result.username
            })
            res.status(200).json({
                token,
                user: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.user_id
            const result = await UserService.getById(userId)
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
            const result = await UserService.update(userId, req.body)
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
            await UserService.delete(userId)
            res.status(200).json({
                message: "Account deleted successfully"
            })
        } catch (error) {
            next(error)
        }
    }
}