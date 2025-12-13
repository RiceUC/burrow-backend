// Sleep session request types
export interface StartSleepRequest {
    start_time: Date
}

export interface EndSleepRequest {
    end_time: Date
    sleep_quality?: number
}

// Sleep session response
export interface SleepSessionResponse {
    session_id: number
    user_id: number
    start_time: Date
    end_time: Date | null
    duration_minutes: number | null
    sleep_quality: number | null
    created_at: Date
}

// Sleep statistics response
export interface SleepStatistics {
    total_sessions: number
    average_duration: number
    average_quality: number
    total_sleep_time: number
    best_sleep_quality: number
    worst_sleep_quality: number
}

// Sleep statistics with daily data (for charts)
export interface SleepStatisticsWithDaily extends SleepStatistics {
    daily_data: DailySleepData[]
}

export interface DailySleepData {
    date: string
    duration_hours: string
    sleep_quality: number | null
}

// Helper function to convert prisma model to response
export function toSleepSessionResponse(session: any): SleepSessionResponse {
    return {
        session_id: session.session_id,
        user_id: session.user_id,
        start_time: session.start_time,
        end_time: session.end_time,
        duration_minutes: session.duration_minutes,
        sleep_quality: session.sleep_quality,
        created_at: session.created_at
    }
}