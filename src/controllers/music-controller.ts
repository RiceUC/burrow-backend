import { Request, Response } from "express"
import { MusicService } from "../services/music-service"

export class MusicController {

  static async list(req: Request, res: Response) {
    try {
      const sounds = await MusicService.getAllSounds()
      res.status(200).json({ data: sounds })
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sounds", error: (error as Error).message })
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const sound = await MusicService.getSoundById(id)
      if (!sound) return res.status(404).json({ message: "Sound not found" })
      res.status(200).json({ data: sound })
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sound", error: (error as Error).message })
    }
  }

  static async upload(req: Request, res: Response) {
    try {
      const file = (req as any).file
      if (!file) return res.status(400).json({ message: "No file uploaded" })

      const title = (req.body && req.body.title) ? req.body.title : file.originalname
      const duration = req.body && req.body.duration ? Number(req.body.duration) : null

      const sound = await MusicService.createSound({ title, file_path: file.filename, duration })
      res.status(201).json({ data: sound })
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file", error: (error as Error).message })
    }
  }

  static async download(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)

      let sound = await MusicService.getSoundById(id)
      // fallback to dummy file if DB record not found (for local testing)
      const fileName = sound ? sound.file_path : "dummy.mp3"
      const audioPath = MusicService.getAudioPath(fileName)

      if (!audioPath) return res.status(404).json({ message: "File not found" })
      // Simpler download for beginners: use `res.download` which handles headers.
      res.download(audioPath, fileName, (err) => {
        if (err) {
          res.status(500).json({ message: "Failed to download file", error: err.message })
        }
      })
    } catch (error) {
      res.status(500).json({ message: "Failed to download file", error: (error as Error).message })
    }
  }
}
