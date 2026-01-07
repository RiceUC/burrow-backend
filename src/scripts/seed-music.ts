
import { MusicService } from "../services/music-service"

async function main() {
    console.log("Seeding music data...")
    try {
        await MusicService.seed()
        console.log("Seeding completed successfully.")
    } catch (e) {
        console.error("Seeding failed:", e)
        process.exit(1)
    }
}

main()
