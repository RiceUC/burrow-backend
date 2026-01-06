import { Request, Response, NextFunction } from "express"
import { JournalService } from "../services/journal-service"
import { CreateJournalRequest } from "../models/journal-model"

export async function createJournal(req: Request, res: Response, next: NextFunction) {
    try {
        const { content, mood } = req.body
        const userId = (req as any).user.user_id

        const request: CreateJournalRequest = {
            user_id: userId,
            content,
            mood
        }

        const journal = await JournalService.create(request)

        res.status(201).json({
            status: 201,
            message: "Journal berhasil dibuat",
            data: journal
        })
    } catch (error) {
        next(error)
    }
}

export async function getJournalById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const journalId = parseInt(id)

        const journal = await JournalService.getById(journalId)

        res.status(200).json({
            status: 200,
            message: "Journal berhasil diambil",
            data: journal
        })
    } catch (error) {
        next(error)
    }
}

export async function getJournalsByUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.params
        const userIdNum = parseInt(userId)
        const currentUserId = (req as any).user.user_id

        // Check if user is requesting their own journals or is admin
        if (userIdNum !== currentUserId) {
            return res.status(403).json({
                status: 403,
                message: "Anda tidak memiliki akses untuk melihat journal pengguna lain"
            })
        }

        const journals = await JournalService.getByUserId(userIdNum)

        res.status(200).json({
            status: 200,
            message: "Journals berhasil diambil",
            data: journals
        })
    } catch (error) {
        next(error)
    }
}

export async function updateJournal(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const { content, mood } = req.body
        const journalId = parseInt(id)
        const userId = (req as any).user.user_id

        const journal = await JournalService.update(journalId, userId, {
            content,
            mood
        })

        res.status(200).json({
            status: 200,
            message: "Journal berhasil diperbarui",
            data: journal
        })
    } catch (error) {
        next(error)
    }
}

export async function deleteJournal(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const journalId = parseInt(id)
        const userId = (req as any).user.user_id

        await JournalService.delete(journalId, userId)

        res.status(200).json({
            status: 200,
            message: "Journal berhasil dihapus"
        })
    } catch (error) {
        next(error)
    }
}
