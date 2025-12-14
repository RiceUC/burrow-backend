import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { UserController } from '../controllers/user-controller'
import { SleepController } from '../controllers/sleep-controller'
import { getJournalsByUser } from "../controllers/journalController"

export const privateRouter = express.Router()

privateRouter.use(authMiddleware)

// User routes
privateRouter.get("/users/profile", UserController.getProfile)
privateRouter.put("/users/profile", UserController.updateProfile)
privateRouter.delete("/users/account", UserController.deleteAccount)

// Sleep routes
privateRouter.post("/sleep/start", SleepController.startSession)
privateRouter.put("/sleep/:sessionId/end", SleepController.endSession)
privateRouter.get("/sleep/sessions", SleepController.getUserSessions)
privateRouter.get("/sleep/sessions/:sessionId", SleepController.getSession)
privateRouter.get("/sleep/statistics", SleepController.getStatistics)
privateRouter.delete("/sleep/sessions/:sessionId", SleepController.deleteSession)

// Journal routes
privateRouter.post('/', createJournal)
privateRouter.get('/single/:id', getJournalById)
privateRouter.get('/:userId', getJournalsByUser)
privateRouter.put('/:id', updateJournal)
privateRouter.delete('/:id', deleteJournal)
