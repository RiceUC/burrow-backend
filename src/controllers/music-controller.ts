import { Request, Response } from "express";
import { MusicService } from "../services/music-service";
import path from "path";

export class MusicController {

  /**
   * Mengambil daftar musik.
   * Pastikan service mengembalikan field 'category' 
   * agar Android bisa memfilter: "About to sleep" atau "While sleeping"
   */
  static async list(req: Request, res: Response) {
    try {
      const sounds = await MusicService.getAllSounds();
      
      // Menambahkan base URL agar Android tahu cara memanggil audio-nya
      const formattedSounds = sounds.map(sound => ({
        ...sound,
        // Contoh: http://10.0.2.2:3000/api/music/1/stream
        audio_url: `${req.protocol}://${req.get('host')}/api/music/${sound.sound_id}/stream`

      }));

      res.status(200).json({ 
        status: "success",
        data: formattedSounds 
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch sounds",
        error: (error as Error).message
      });
    }
  }

  /**
   * Mendapatkan metadata satu lagu saja
   */
  static async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const sound = await MusicService.getSoundById(id);

      if (!sound) {
        return res.status(404).json({ message: "Sound not found" });
      }

      res.status(200).json({ data: sound });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Stream musik langsung ke Media Player Android
   */
  static async download(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const sound = await MusicService.getSoundById(id);

      if (!sound) {
        return res.status(404).json({ message: "Sound not found" });
      }

      const audioPath = MusicService.getAudioPath(sound.file_path);
      
      // Validasi fisik file
      if (!audioPath) {
        return res.status(404).json({ message: "Audio file path not configured" });
      }

      // Header penting untuk streaming audio
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Accept-Ranges", "bytes"); // Memungkinkan user untuk 'seek' (geser durasi)
      res.setHeader("Content-Disposition", "inline"); // Membuka langsung di player, bukan download

      res.sendFile(audioPath, (err) => {
        if (err) {
          if (!res.headersSent) {
            res.status(404).json({ message: "File not found on disk" });
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to play audio",
        error: (error as Error).message
      });
    }
  }
}