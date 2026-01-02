import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database with sounds...")

  // Clear existing sounds
  await prisma.sound.deleteMany({})
  console.log("🗑️  Cleared existing sounds")

  // Insert sounds
  const sounds = await prisma.sound.createMany({
    data: [
      {
        title: "Pink Noise",
        file_path: "PinkNoise.mp3",
        duration: 300,
        category: "About to sleep"
      },
      {
        title: "Air Mengalir",
        file_path: "AirMengalir.mp3",
        duration: 300,
        category: "About to sleep"
      },
      {
        title: "Binaural Beats Theta",
        file_path: "BinauralBeatsTheta.mp3",
        duration: 300,
        category: "About to sleep"
      },
      {
        title: "Brown Noise",
        file_path: "BrownNoise.mp3",
        duration: 300,
        category: "While sleeping"
      },
      {
        title: "Delta Waves Binaural Beats",
        file_path: "DeltaWavesBinauralBeats.mp3",
        duration: 300,
        category: "While sleeping"
      },
      {
        title: "Hujan Lebat",
        file_path: "HujanLebat.mp3",
        duration: 300,
        category: "While sleeping"
      }
    ]
  })

  console.log(`✅ Seeded ${sounds.count} sounds`)
}

main()
  .catch(e => {
    console.error("❌ Seeding error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
