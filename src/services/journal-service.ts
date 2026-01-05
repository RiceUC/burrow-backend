import { prismaClient } from "../utils/database-util"
import { ResponseError } from "../error/response-error"
import { Validation } from "../validations/validation"
import { JournalValidation } from "../validations/journal-validation"

import {
    CreateJournalRequest,
    UpdateJournalRequest,
    JournalResponse,
    JournalWithUserResponse,
    toJournalResponse,
    toJournalWithUserResponse
} from "../models/journal-model"

export class JournalService {

    static async create(request: CreateJournalRequest): Promise<JournalResponse> {
        const validated = Validation.validate(JournalValidation.CREATE, request)

        const user = await prismaClient.user.findUnique({
            where: { user_id: validated.user_id }
        })
        if (!user) {
            throw new ResponseError(404, "User tidak ditemukan")
        }
        const journal = await prismaClient.journalEntry.create({
            data: {
                user_id: validated.user_id,
                content: validated.content,
                mood: validated.mood
            }
        })

        return toJournalResponse(journal)
    }

    static async getById(journalId: number): Promise<JournalWithUserResponse> {
        const journal = await prismaClient.journalEntry.findUnique({
            where: { journal_id: journalId },
            include: { user: true }
        })

        if (!journal) {
            throw new ResponseError(404, "Journal tidak ditemukan")
        }

        return toJournalWithUserResponse(journal)
    }

    static async getByUserId(userId: number): Promise<JournalResponse[]> {
        const user = await prismaClient.user.findUnique({
            where: { user_id: userId }
        })
        if (!user) {
            throw new ResponseError(404, "User tidak ditemukan")
        }

        const journals = await prismaClient.journalEntry.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        })

        return journals.map(journal => toJournalResponse(journal))
    }

    static async update(journalId: number, userId: number, request: UpdateJournalRequest): Promise<JournalResponse> {
        const validated = Validation.validate(JournalValidation.UPDATE, request)

        const journal = await prismaClient.journalEntry.findUnique({
            where: { journal_id: journalId }
        })
        if (!journal) {
            throw new ResponseError(404, "Journal tidak ditemukan")
        }

        if (journal.user_id !== userId) {
            throw new ResponseError(403, "Anda tidak memiliki akses untuk mengubah journal ini")
        }

        const updated = await prismaClient.journalEntry.update({
            where: { journal_id: journalId },
            data: {
                content: validated.content ?? journal.content,
                mood: validated.mood ?? journal.mood
            }
        })

        return toJournalResponse(updated)
    }

    static async delete(journalId: number, userId: number): Promise<void> {
        const journal = await prismaClient.journalEntry.findUnique({
            where: { journal_id: journalId }
        })
        if (!journal) {
            throw new ResponseError(404, "Journal tidak ditemukan")
        }

        if (journal.user_id !== userId) {
            throw new ResponseError(403, "Anda tidak memiliki akses untuk menghapus journal ini")
        }

        await prismaClient.journalEntry.delete({
            where: { journal_id: journalId }
        })
    }
}
