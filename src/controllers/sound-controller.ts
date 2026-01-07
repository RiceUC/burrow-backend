import { Request, Response, NextFunction } from "express"
import { SoundService } from "../services/sound-service"
import { SoundCategory } from "../models/sound-model"

export class SoundController {
    // Upload sound file with metadata
    static async upload(req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] }
            
            if (!files || !files.sound || files.sound.length === 0) {
                return res.status(400).json({
                    status: 400,
                    message: "Sound file is required"
                })
            }

            const soundFile = files.sound[0]
            const thumbnailFile = files.thumbnail ? files.thumbnail[0] : null

            // Get metadata from body
            const { title, category, duration } = req.body

            if (!title || !category || !duration) {
                return res.status(400).json({
                    status: 400,
                    message: "Title, category, and duration are required"
                })
            }

            const soundData = {
                title,
                category,
                duration: parseInt(duration),
                file_path: soundFile.path,
                thumbnail_path: thumbnailFile?.path
            }

            const result = await SoundService.create(soundData)
            res.status(201).json({
                status: 201,
                message: "Sound uploaded successfully",
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    // Create sound (admin only in production)
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await SoundService.create(req.body)
            res.status(201).json({
                status: 201,
                message: "Sound created successfully",
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    // Get all sounds or filter by category
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const category = req.query.category as SoundCategory | undefined
            const result = await SoundService.getAll(category)
            res.status(200).json({
                status: 200,
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    // Get sounds by specific category (for the UI screens)
    static async getByCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { category } = req.params
            
            if (category !== 'about_to_sleep' && category !== 'while_sleeping') {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid category. Must be 'about_to_sleep' or 'while_sleeping'"
                })
            }

            const result = await SoundService.getByCategory(category as SoundCategory)
            res.status(200).json({
                status: 200,
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    // Get single sound
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const sound_id = parseInt(req.params.id)
            const result = await SoundService.getById(sound_id)
            res.status(200).json({
                status: 200,
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    // Update sound
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const sound_id = parseInt(req.params.id)
            const result = await SoundService.update(sound_id, req.body)
            res.status(200).json({
                status: 200,
                message: "Sound updated successfully",
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    // Delete sound
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const sound_id = parseInt(req.params.id)
            await SoundService.delete(sound_id)
            res.status(200).json({
                status: 200,
                message: "Sound deleted successfully"
            })
        } catch (error) {
            next(error)
        }
    }
}