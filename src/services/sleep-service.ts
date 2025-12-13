import { prismaClient } from "../utils/database-util"
import { ResponseError } from "../error/response-error"
import { Validation } from "../validations/validation"
import { SleepValidation } from "../validations/sleep-validation"
import {
    StartSleepRequest,
    EndSleepRequest,
    SleepSessionResponse,
    SleepStatistics,
    SleepStatisticsWithDaily,
    toSleepSessionResponse
} from "../models/sleep-model"

export class SleepService {
    // Start new sleep session
    static async startSession(user_id: number, request: StartSleepRequest): Promise<SleepSessionResponse> {
        const validated = Validation.validate(SleepValidation.START, request)

        // Check if there's an active session (end_time is null)
        const activeSession = await prismaClient.sleepSession.findFirst({
            where: {
                user_id,
                end_time: null
            }
        })

        if (activeSession) {
            throw new ResponseError(400, "You already have an active sleep session")
        }

        const session = await prismaClient.sleepSession.create({
            data: {
                user_id,
                start_time: new Date(validated.start_time),
                end_time: null
            }
        })

        return toSleepSessionResponse(session)
    }

    // End sleep session
    static async endSession(user_id: number, session_id: number, request: EndSleepRequest): Promise<SleepSessionResponse> {
        const validated = Validation.validate(SleepValidation.END, request)

        const session = await prismaClient.sleepSession.findFirst({
            where: { session_id, user_id }
        })

        if (!session) {
            throw new ResponseError(404, "Sleep session not found")
        }

        if (session.end_time !== null) {
            throw new ResponseError(400, "Sleep session already ended")
        }

        const endTime = new Date(validated.end_time)
        const startTime = new Date(session.start_time)
        const durationMs = endTime.getTime() - startTime.getTime()
        const durationMinutes = Math.floor(durationMs / (1000 * 60))

        if (durationMinutes < 0) {
            throw new ResponseError(400, "End time must be after start time")
        }

        const updated = await prismaClient.sleepSession.update({
            where: { session_id },
            data: {
                end_time: endTime,
                duration_minutes: durationMinutes,
                sleep_quality: validated.sleep_quality
            }
        })

        return toSleepSessionResponse(updated)
    }

    // Get all sessions for a user
    static async getUserSessions(user_id: number): Promise<SleepSessionResponse[]> {
        const sessions = await prismaClient.sleepSession.findMany({
            where: { user_id },
            orderBy: { created_at: 'desc' }
        })

        return sessions.map(toSleepSessionResponse)
    }

    // Get specific session
    static async getSession(user_id: number, session_id: number): Promise<SleepSessionResponse> {
        const session = await prismaClient.sleepSession.findFirst({
            where: { session_id, user_id }
        })

        if (!session) {
            throw new ResponseError(404, "Sleep session not found")
        }

        return toSleepSessionResponse(session)
    }

    // Get sleep statistics
    static async getStatistics(user_id: number): Promise<SleepStatistics> {
        const sessions = await prismaClient.sleepSession.findMany({
            where: { 
                user_id,
                duration_minutes: { not: null },
                end_time: { not: null }
            }
        })

        if (sessions.length === 0) {
            return {
                total_sessions: 0,
                average_duration: 0,
                average_quality: 0,
                total_sleep_time: 0,
                best_sleep_quality: 0,
                worst_sleep_quality: 0
            }
        }

        const totalDuration = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
        const qualitySessions = sessions.filter(s => s.sleep_quality !== null)
        const totalQuality = qualitySessions.reduce((sum, s) => sum + (s.sleep_quality || 0), 0)
        const qualities = qualitySessions.map(s => s.sleep_quality || 0)

        return {
            total_sessions: sessions.length,
            average_duration: Math.round(totalDuration / sessions.length),
            average_quality: qualitySessions.length > 0 ? Math.round(totalQuality / qualitySessions.length) : 0,
            total_sleep_time: totalDuration,
            best_sleep_quality: qualities.length > 0 ? Math.max(...qualities) : 0,
            worst_sleep_quality: qualities.length > 0 ? Math.min(...qualities) : 0
        }
    }

    // Get statistics by date range
    static async getStatisticsByRange(
        user_id: number, 
        start_date: string, 
        end_date: string
    ): Promise<SleepStatisticsWithDaily> {
        
        const startDate = new Date(start_date)
        const endDate = new Date(end_date)

        const sessions = await prismaClient.sleepSession.findMany({
            where: { 
                user_id,
                duration_minutes: { not: null },
                end_time: { not: null },
                start_time: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: { start_time: 'asc' }
        })

        if (sessions.length === 0) {
            return {
                total_sessions: 0,
                average_duration: 0,
                average_quality: 0,
                total_sleep_time: 0,
                best_sleep_quality: 0,
                worst_sleep_quality: 0,
                daily_data: []
            }
        }

        // Calculate basic stats
        const totalDuration = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
        const qualitySessions = sessions.filter(s => s.sleep_quality !== null)
        const totalQuality = qualitySessions.reduce((sum, s) => sum + (s.sleep_quality || 0), 0)
        const qualities = qualitySessions.map(s => s.sleep_quality || 0)

        // Group by date for chart
        const dailyData = sessions.map(session => ({
            date: session.start_time.toISOString().split('T')[0],
            duration_hours: ((session.duration_minutes || 0) / 60).toFixed(1),
            sleep_quality: session.sleep_quality
        }))

        return {
            total_sessions: sessions.length,
            average_duration: Math.round(totalDuration / sessions.length),
            average_quality: qualitySessions.length > 0 ? Math.round(totalQuality / qualitySessions.length) : 0,
            total_sleep_time: totalDuration,
            best_sleep_quality: qualities.length > 0 ? Math.max(...qualities) : 0,
            worst_sleep_quality: qualities.length > 0 ? Math.min(...qualities) : 0,
            daily_data: dailyData
        }
    }

    // Delete session
    static async deleteSession(user_id: number, session_id: number): Promise<void> {
        const session = await prismaClient.sleepSession.findFirst({
            where: { session_id, user_id }
        })

        if (!session) {
            throw new ResponseError(404, "Sleep session not found")
        }

        await prismaClient.sleepSession.delete({
            where: { session_id }
        })
    }
}
