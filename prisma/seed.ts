// prisma/seed.ts

import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Sample sounds for "About to Sleep" category
    const aboutToSleep = [
        {
            title: 'Night Island',
            category: 'about_to_sleep' as const,
            duration: 1800, // 30 minutes in seconds
            file_path: '/uploads/sounds/night-island.mp3',
            thumbnail_path: '/uploads/thumbnails/night-island.png'
        },
        {
            title: 'Moon and Cloud',
            category: 'about_to_sleep' as const,
            duration: 1800,
            file_path: '/uploads/sounds/moon-cloud.mp3',
            thumbnail_path: '/uploads/thumbnails/moon-cloud.png'
        },
        {
            title: 'Sleep Owl',
            category: 'about_to_sleep' as const,
            duration: 1800,
            file_path: '/uploads/sounds/sleep-owl.mp3',
            thumbnail_path: '/uploads/thumbnails/sleep-owl.png'
        }
    ]

    // Sample sounds for "While Sleeping" category
    const whileSleeping = [
        {
            title: 'Moon and Cloud',
            category: 'while_sleeping' as const,
            duration: 3600, // 60 minutes
            file_path: '/uploads/sounds/moon-cloud-long.mp3',
            thumbnail_path: '/uploads/thumbnails/moon-cloud-long.png'
        },
        {
            title: 'Sleep Owl',
            category: 'while_sleeping' as const,
            duration: 3600,
            file_path: '/uploads/sounds/sleep-owl-long.mp3',
            thumbnail_path: '/uploads/thumbnails/sleep-owl-long.png'
        },
        {
            title: 'Night Island',
            category: 'while_sleeping' as const,
            duration: 3600,
            file_path: '/uploads/sounds/night-island-long.mp3',
            thumbnail_path: '/uploads/thumbnails/night-island-long.png'
        },
        {
            title: 'Cloud Dreams',
            category: 'while_sleeping' as const,
            duration: 3600,
            file_path: '/uploads/sounds/cloud-dreams.mp3',
            thumbnail_path: '/uploads/thumbnails/cloud-dreams.png'
        }
    ]

    // Create sounds
    for (const sound of [...aboutToSleep, ...whileSleeping]) {
        await prisma.sound.upsert({
            where: { 
                // Use a composite unique identifier or just create
                sound_id: 0 // This will always create new
            },
            update: {},
            create: sound
        })
        console.log(`✅ Created sound: ${sound.title} (${sound.category})`)
    }

    console.log('🎉 Seeding completed!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }
)