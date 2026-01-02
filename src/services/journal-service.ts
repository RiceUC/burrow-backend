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

    // CREATE JOURNAL ENTRY
    static async create(request: CreateJournalRequest): Promise<JournalResponse> {
        // Validate data
        const validated = Validation.validate(JournalValidation.CREATE, request)

        // Check if user exists
        const user = await prismaClient.user.findUnique({
            where: { user_id: validated.user_id }
        })
        if (!user) {
            throw new ResponseError(404, "User tidak ditemukan")
        }

        // Create journal entry
        const journal = await prismaClient.journalEntry.create({
            data: {
                user_id: validated.user_id,
                content: validated.content,
                mood: validated.mood
            }
        })

        return toJournalResponse(journal)
    }

    // GET JOURNAL BY ID
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

    // GET ALL JOURNALS BY USER ID
    static async getByUserId(userId: number): Promise<JournalResponse[]> {
        // Check if user exists
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

    // UPDATE JOURNAL ENTRY
    static async update(journalId: number, userId: number, request: UpdateJournalRequest): Promise<JournalResponse> {
        // Validate data
        const validated = Validation.validate(JournalValidation.UPDATE, request)

        // Check if journal exists
        const journal = await prismaClient.journalEntry.findUnique({
            where: { journal_id: journalId }
        })
        if (!journal) {
            throw new ResponseError(404, "Journal tidak ditemukan")
        }

        // Check if user owns this journal
        if (journal.user_id !== userId) {
            throw new ResponseError(403, "Anda tidak memiliki akses untuk mengubah journal ini")
        }

        // Update journal
        const updated = await prismaClient.journalEntry.update({
            where: { journal_id: journalId },
            data: {
                content: validated.content ?? journal.content,
                mood: validated.mood ?? journal.mood
            }
        })

        return toJournalResponse(updated)
    }

    // DELETE JOURNAL ENTRY
    static async delete(journalId: number, userId: number): Promise<void> {
        // Check if journal exists
        const journal = await prismaClient.journalEntry.findUnique({
            where: { journal_id: journalId }
        })
        if (!journal) {
            throw new ResponseError(404, "Journal tidak ditemukan")
        }

        // Check if user owns this journal
        if (journal.user_id !== userId) {
            throw new ResponseError(403, "Anda tidak memiliki akses untuk menghapus journal ini")
        }

        // Delete journal
        await prismaClient.journalEntry.delete({
            where: { journal_id: journalId }
        })
    }
}
