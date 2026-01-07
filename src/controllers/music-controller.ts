import { Request, Response, NextFunction } from "express"
import { MusicService } from "../services/music-service"

export class MusicController {
    static async getAllMusic(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await MusicService.getAll()
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async seedMusic(req: Request, res: Response, next: NextFunction) {
        try {
            await MusicService.seed()
            res.status(200).json({
                message: "Music data seeded successfully"
            })
        } catch (error) {
            next(error)
        }
    }
}
