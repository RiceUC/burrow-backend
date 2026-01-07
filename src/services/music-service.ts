import { prismaClient as prisma } from "../utils/database-util"
import { MusicCategory } from "../../generated/prisma"

export class MusicService {
    static async getAll() {
        return await prisma.music.findMany()
    }

    static async seed() {
        // Clear existing data
        await prisma.music.deleteMany()

        // Seed new data
        await prisma.music.createMany({
            data: [
                // Before Sleep
                {
                    title: "Relaxing Rain",
                    videoId: "35AdtzquJYg",
                    category: MusicCategory.BEFORE_SLEEP,
                    duration: "60 min"
                },
                {
                    title: "Cozy Fireplace",
                    videoId: "0fYL_qiDYf0",
                    category: MusicCategory.BEFORE_SLEEP,
                    duration: "60 min"
                },
                {
                    title: "Night Crickets",
                    videoId: "K1Trb6M9cRs",
                    category: MusicCategory.BEFORE_SLEEP,
                    duration: "60 min"
                },
                {
                    title: "Calming Waves",
                    videoId: "Nep1qytq9JM",
                    category: MusicCategory.BEFORE_SLEEP,
                    duration: "60 min"
                },
                {
                    title: "Thunderstorm",
                    videoId: "TdItjP23qVI",
                    category: MusicCategory.BEFORE_SLEEP,
                    duration: "60 min"
                },
                // During Sleep
                {
                    title: "Relaxing Rain",
                    videoId: "35AdtzquJYg",
                    category: MusicCategory.DURING_SLEEP,
                    duration: "20 min"
                },
                {
                    title: "Cozy Fireplace",
                    videoId: "0fYL_qiDYf0",
                    category: MusicCategory.DURING_SLEEP,
                    duration: "20 min"
                },
                {
                    title: "Night Crickets",
                    videoId: "K1Trb6M9cRs",
                    category: MusicCategory.DURING_SLEEP,
                    duration: "20 min"
                },
                {
                    title: "Calming Waves",
                    videoId: "Nep1qytq9JM",
                    category: MusicCategory.DURING_SLEEP,
                    duration: "20 min"
                },
                {
                    title: "Thunderstorm",
                    videoId: "TdItjP23qVI",
                    category: MusicCategory.DURING_SLEEP,
                    duration: "20 min"
                }
            ]
        })
    }
}
