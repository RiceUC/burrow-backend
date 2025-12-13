import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { UserController } from '../controllers/user-controller'
import { SleepController } from '../controllers/sleep-controller'

export const privateRouter = express.Router()

privateRouter.use(authMiddleware)

// User routes
privateRouter.get("/users/profile", authMiddleware, UserController.getProfile)
privateRouter.put("/users/profile", authMiddleware, UserController.updateProfile)
privateRouter.delete("/users/account", authMiddleware, UserController.deleteAccount)

// Sleep routes
privateRouter.post("/sleep/start", SleepController.startSession)
privateRouter.put("/sleep/:sessionId/end", SleepController.endSession)
privateRouter.get("/sleep/sessions", SleepController.getUserSessions)
privateRouter.get("/sleep/sessions/:sessionId", SleepController.getSession)
privateRouter.get("/sleep/statistics", SleepController.getStatistics)
privateRouter.delete("/sleep/sessions/:sessionId", SleepController.deleteSession)