import express from 'express'
import fs from "fs"
import path from "path"
import { UserController } from '../controllers/user-controller'
import { MusicController } from '../controllers/music-controller'
import { upload } from '../middlewares/upload-middleware'

export const publicRouter = express.Router()

publicRouter.post("/register", UserController.register)
publicRouter.post("/login", UserController.login)

publicRouter.get("/music", MusicController.list)
publicRouter.get("/music/:id", MusicController.get)
publicRouter.post("/music/upload", upload.single('file'), MusicController.upload)
publicRouter.get("/music/:id/download", MusicController.download)