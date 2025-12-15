import fs from "fs"
import path from "path"
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export class MusicService {

  static async getSoundById(id: number) {
    return prisma.sound.findUnique({
      where: { sound_id: id }
    })
  }

  static async getAllSounds() {
    return prisma.sound.findMany({
      orderBy: { sound_id: 'asc' }
    })
  }

  static getAudioPath(filePath: string) {
    return path.join(
      process.cwd(),
      "uploads",
      "music",
      filePath
    )
  }

  static async createSound(data: { title: string; file_path: string; duration?: number | null }) {
    return prisma.sound.create({
      data: {
        title: data.title,
        file_path: data.file_path,
        duration: data.duration ?? null
      }
    })
  }
}