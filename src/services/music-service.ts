import fs from "fs"
import path from "path"
import { PrismaClient } from "../../generated/prisma"; // Pastikan path ini benar atau gunakan @prisma/client

const prisma = new PrismaClient();

export class MusicService {

  static async getSoundById(id: number) {
    return prisma.sound.findUnique({
      where: { sound_id: id }
    });
  }

  static async getAllSounds() {
    return prisma.sound.findMany({
      orderBy: { sound_id: 'asc' }
    });
  }

  /**
   * Mengambil file path absolut untuk streaming
   */
  static getAudioPath(filePath: string) {
    const absolutePath = path.join(
      process.cwd(),
      "uploads",
      "music",
      filePath
    );

    // Tambahan: Cek apakah file benar-benar ada di folder sebelum dikirim
    if (fs.existsSync(absolutePath)) {
      return absolutePath;
    }
    return null;
  }

  /**
   * Tambahkan field category agar sinkron dengan Android
   */
  static async createSound(data: { 
    title: string; 
    file_path: string; 
    category: string; // Tambahkan ini
    duration?: number | null 
  }) {
    return prisma.sound.create({
      data: {
        title: data.title,
        file_path: data.file_path,
        category: data.category, // Tambahkan ini
        duration: data.duration ?? null
      }
    });
  }
}