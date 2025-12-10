import bcrypt from "bcrypt"
import { prismaClient } from "../utils/database-util"
import { ResponseError } from "../error/response-error"
import { 
    RegisterUserRequest, 
    LoginUserRequest, 
    UserResponse, 
    AuthResponse 
} from "../models/user-model"
import { Validation } from "../validations/validation"
import { UserValidation } from "../validations/user-validation"
import { generateToken } from "../utils/jwt-util"

export class UserService {
    // Register new user
    static async register(request: RegisterUserRequest): Promise<AuthResponse> {
        // Validate request
        const registerRequest = Validation.validate(
            UserValidation.REGISTER,
            request
        )

        // Check if username already exists
        const existingUser = await prismaClient.user.findFirst({
            where: {
                username: registerRequest.username,
            },
        })

        if (existingUser) {
            throw new ResponseError(400, "Username already exists")
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerRequest.password, 10)

        // Create user
        const user = await prismaClient.user.create({
            data: {
                username: registerRequest.username,
                password: hashedPassword,
                name: registerRequest.name,
            },
        })

        // Generate token
        const token = generateToken({
            user_id: user.user_id,
            username: user.username,
        })

        // Return response without password
        return {
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                name: user.name,
                birthdate: user.birthdate,
                default_sound_duration: user.default_sound_duration,
                reminder_time: user.reminder_time,
                gender: user.gender,
                created_at: user.created_at,
            },
        }
    }

    // Login user
    static async login(request: LoginUserRequest): Promise<AuthResponse> {
        // Validate request
        const loginRequest = Validation.validate(
            UserValidation.LOGIN,
            request
        )

        // Find user by username
        const user = await prismaClient.user.findFirst({
            where: {
                username: loginRequest.username,
            },
        })

        if (!user) {
            throw new ResponseError(401, "Invalid username or password")
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            loginRequest.password,
            user.password
        )

        if (!isPasswordValid) {
            throw new ResponseError(401, "Invalid username or password")
        }

        // Generate token
        const token = generateToken({
            user_id: user.user_id,
            username: user.username,
        })

        // Return response without password
        return {
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                name: user.name,
                birthdate: user.birthdate,
                default_sound_duration: user.default_sound_duration,
                reminder_time: user.reminder_time,
                gender: user.gender,
                created_at: user.created_at,
            },
        }
    }

    // Get user by ID
    static async getUserById(userId: number): Promise<UserResponse> {
        const user = await prismaClient.user.findUnique({
            where: {
                user_id: userId,
            },
        })

        if (!user) {
            throw new ResponseError(404, "User not found")
        }

        // Return user without password
        return {
            user_id: user.user_id,
            username: user.username,
            name: user.name,
            birthdate: user.birthdate,
            default_sound_duration: user.default_sound_duration,
            reminder_time: user.reminder_time,
            gender: user.gender,
            created_at: user.created_at,
        }
    }

    // Update user profile
    static async updateProfile(
        userId: number,
        request: Partial<UserResponse>
    ): Promise<UserResponse> {
        // Validate request
        const updateRequest = Validation.validate(
            UserValidation.UPDATE,
            request
        )

        // Check if user exists
        const existingUser = await prismaClient.user.findUnique({
            where: {
                user_id: userId,
            },
        })

        if (!existingUser) {
            throw new ResponseError(404, "User not found")
        }

        // Update user
        const updatedUser = await prismaClient.user.update({
            where: {
                user_id: userId,
            },
            data: {
                name: updateRequest.name,
                birthdate: updateRequest.birthdate 
                    ? new Date(updateRequest.birthdate) 
                    : undefined,
                default_sound_duration: updateRequest.default_sound_duration,
                reminder_time: updateRequest.reminder_time 
                    ? new Date(updateRequest.reminder_time) 
                    : undefined,
                gender: updateRequest.gender,
            },
        })

        // Return updated user without password
        return {
            user_id: updatedUser.user_id,
            username: updatedUser.username,
            name: updatedUser.name,
            birthdate: updatedUser.birthdate,
            default_sound_duration: updatedUser.default_sound_duration,
            reminder_time: updatedUser.reminder_time,
            gender: updatedUser.gender,
            created_at: updatedUser.created_at,
        }
    }

    // Delete user
    static async deleteUser(userId: number): Promise<void> {
        // Check if user exists
        const user = await prismaClient.user.findUnique({
            where: {
                user_id: userId,
            },
        })

        if (!user) {
            throw new ResponseError(404, "User not found")
        }

        // Delete user (cascade will delete related data)
        await prismaClient.user.delete({
            where: {
                user_id: userId,
            },
        })
    }
}