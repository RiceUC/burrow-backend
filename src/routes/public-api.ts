import express from 'express'
import { UserController } from '../controllers/user-controller'

import { MusicController } from '../controllers/music-controller'

export const publicRouter = express.Router()

publicRouter.post("/register", UserController.register)
publicRouter.post("/login", UserController.login)
publicRouter.post("/refresh-token", UserController.refreshToken)
publicRouter.post("/music/seed", MusicController.seedMusic)