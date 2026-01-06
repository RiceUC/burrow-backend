import jwt from "jsonwebtoken"
import { UserJWTPayload } from "../models/user-model"
import { StringValue } from "ms"
import { JWT_SECRET_KEY } from "./env-util"

export const generateToken = (
    payload: UserJWTPayload,
    expiryTime: StringValue = "1h"
): string => {
    return jwt.sign(payload, JWT_SECRET_KEY || "secret_key", {
        expiresIn: expiryTime,
    })
}

export const generateAccessToken = (payload: UserJWTPayload): string => {
    return generateToken(payload, "1h")
}

export const generateRefreshToken = (payload: UserJWTPayload): string => {
    return generateToken(payload, "7d")
}

export const verifyToken = (token: string): UserJWTPayload => {
    return jwt.verify(token, JWT_SECRET_KEY || "secret_key") as UserJWTPayload
}