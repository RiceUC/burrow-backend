// JWT Payload type
export interface UserJWTPayload {
    user_id: number
    username: string
}

// Register request
export interface RegisterUserRequest {
    username: string
    password: string
    name?: string
}

// Login request
export interface LoginUserRequest {
    username: string
    password: string
}

// User response (without password)
export interface UserResponse {
    user_id: number
    username: string
    name: string
    birthdate?: Date | null
    default_sound_duration?: number | null
    reminder_time?: Date | null
    gender?: string | null
    created_at: Date
}

// Auth response with token
export interface AuthResponse {
    token: string
    user: UserResponse
}