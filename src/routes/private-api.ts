import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { UserController } from '../controllers/user-controller'
import { SleepController } from '../controllers/sleep-controller'
import { createJournal, getJournalById, getJournalsByUser, updateJournal, deleteJournal } from '../controllers/journal-controller'

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
privateRouter.post('/journals', createJournal)              // POST /journals
privateRouter.get('/journals/single/:id', getJournalById)  // GET /journals/single/:id (SPECIFIC - HARUS DULUAN!)
privateRouter.get('/journals/:userId', getJournalsByUser)  // GET /journals/:userId (GENERIC - BELAKANGAN)
privateRouter.put('/journals/:id', updateJournal)          // PUT /journals/:id
privateRouter.delete('/journals/:id', deleteJournal)       // DELETE /journals/:id
