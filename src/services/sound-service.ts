// src/services/sound-service.ts

import { prismaClient } from "../utils/database-util"
import { ResponseError } from "../error/response-error"
import { Validation } from "../validations/validation"
import { SoundValidation } from "../validations/sound-validation"
import {
    CreateSoundRequest,
    UpdateSoundRequest,
    SoundResponse,
    SoundCategory,
    toSoundResponse
} from "../models/sound-model"

export class SoundService {
    // Create new sound
    static async create(request: CreateSoundRequest): Promise<SoundResponse> {
        const validated = Validation.validate(SoundValidation.CREATE, request)

        const sound = await prismaClient.sound.create({
            data: {
                title: validated.title,
                category: validated.category,
                duration: validated.duration,
                file_path: validated.file_path,
                thumbnail_path: validated.thumbnail_path
            }
        })

        return toSoundResponse(sound)
    }

    // Get all sounds (optionally filter by category)
    static async getAll(category?: SoundCategory): Promise<SoundResponse[]> {
        const sounds = await prismaClient.sound.findMany({
            where: category ? { category } : undefined,
            orderBy: { created_at: 'desc' }
        })

        return sounds.map(toSoundResponse)
    }

    // Get sounds by category for the UI
    static async getByCategory(category: SoundCategory): Promise<SoundResponse[]> {
        const sounds = await prismaClient.sound.findMany({
            where: { category },
            orderBy: { title: 'asc' }
        })

        return sounds.map(toSoundResponse)
    }

    // Get single sound
    static async getById(sound_id: number): Promise<SoundResponse> {
        const sound = await prismaClient.sound.findUnique({
            where: { sound_id }
        })

        if (!sound) {
            throw new ResponseError(404, "Sound not found")
        }

        return toSoundResponse(sound)
    }

    // Update sound metadata
    static async update(sound_id: number, request: UpdateSoundRequest): Promise<SoundResponse> {
        const validated = Validation.validate(SoundValidation.UPDATE, request)

        const sound = await prismaClient.sound.findUnique({
            where: { sound_id }
        })

        if (!sound) {
            throw new ResponseError(404, "Sound not found")
        }

        const updated = await prismaClient.sound.update({
            where: { sound_id },
            data: {
                title: validated.title ?? sound.title,
                category: validated.category ?? sound.category,
                duration: validated.duration ?? sound.duration,
                thumbnail_path: validated.thumbnail_path ?? sound.thumbnail_path
            }
        })

        return toSoundResponse(updated)
    }

    // Delete sound
    static async delete(sound_id: number): Promise<void> {
        const sound = await prismaClient.sound.findUnique({
            where: { sound_id }
        })

        if (!sound) {
            throw new ResponseError(404, "Sound not found")
        }

        // Check if sound is being used in any sleep sessions
        const sessionsUsingSound = await prismaClient.sleepSession.count({
            where: { sound_id }
        })

        if (sessionsUsingSound > 0) {
            throw new ResponseError(400, `Cannot delete sound: it's being used in ${sessionsUsingSound} sleep session(s)`)
        }

        await prismaClient.sound.delete({
            where: { sound_id }
        })
    }
}