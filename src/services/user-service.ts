import bcrypt from "bcrypt"
import { prismaClient } from "../utils/database-util"
import { ResponseError } from "../error/response-error"
import { Validation } from "../validations/validation"
import { UserValidation } from "../validations/user-validation"

import {
    RegisterUserRequest,
    LoginUserRequest,
    UserResponse,
    toUserResponse
} from "../models/user-model"

export class UserService {

    // REGISTER USER
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        // Validate data
        const validated = Validation.validate(UserValidation.REGISTER, request)

        // Check username exists
        const existing = await prismaClient.user.findUnique({
            where: { username: validated.username }
        })
        if (existing) {
            throw new ResponseError(409, "Username already taken")
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validated.password, 10)

        // Create user
        const user = await prismaClient.user.create({
            data: {
                username: validated.username,
                password: hashedPassword,
                name: validated.name ?? ""
            }
        })

        return toUserResponse(user)
    }

    // LOGIN
    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const validated = Validation.validate(UserValidation.LOGIN, request)

        const user = await prismaClient.user.findUnique({
            where: { username: validated.username }
        })

        if (!user) {
            throw new ResponseError(401, "Invalid username or password")
        }

        const match = await bcrypt.compare(validated.password, user.password)
        if (!match) {
            throw new ResponseError(401, "Invalid username or password")
        }

        return toUserResponse(user)
    }

    // GET USER BY ID
    static async getById(user_id: number): Promise<UserResponse> {
        const user = await prismaClient.user.findUnique({
            where: { user_id }
        })

        if (!user) {
            throw new ResponseError(404, "User not found")
        }

        return toUserResponse(user)
    }

    // UPDATE USER
    static async update(user_id: number, data: Partial<RegisterUserRequest>): Promise<UserResponse> {
        // Validate allowed fields
        const validated = Validation.validate(UserValidation.UPDATE, data)

        const user = await prismaClient.user.findUnique({
            where: { user_id }
        })
        if (!user) {
            throw new ResponseError(404, "User not found")
        }

        const updateData: any = {}

        if (validated.username) updateData.username = validated.username
        if (validated.name) updateData.name = validated.name
        if (validated.password) updateData.password = await bcrypt.hash(validated.password, 10)

        const updated = await prismaClient.user.update({
            where: { user_id },
            data: updateData
        })

        return toUserResponse(updated)
    }

    // DELETE USER
    static async delete(user_id: number): Promise<void> {
        const user = await prismaClient.user.findUnique({
            where: { user_id }
        })
        if (!user) throw new ResponseError(404, "User not found")

        await prismaClient.user.delete({
            where: { user_id }
        })
    }
}
