import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { UserController } from '../controllers/user-controller'

export const privateRouter = express.Router()

privateRouter.use(authMiddleware)

// Protected routes
privateRouter.get("/users/profile", authMiddleware, UserController.getProfile)
privateRouter.put("/users/profile", authMiddleware, UserController.updateProfile)
privateRouter.delete("/users/account", authMiddleware, UserController.deleteAccount)
