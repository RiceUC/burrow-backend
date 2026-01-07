export type SoundCategory = 'about_to_sleep' | 'while_sleeping'

export interface StartSleepRequest {
    start_time: Date
    sound_id?: number 
}

export interface CreateSoundRequest {
    title: string
    category: SoundCategory
    duration: number
    file_path: string
    thumbnail_path?: string
}

export interface UpdateSoundRequest {
    title?: string
    category?: SoundCategory
    duration?: number
    thumbnail_path?: string
}

export interface SoundResponse {
    sound_id: number
    title: string
    category: SoundCategory
    duration: number
    file_path: string
    thumbnail_path: string | null
    created_at: Date
}

export function toSoundResponse(sound: any): SoundResponse {
    return {
        sound_id: sound.sound_id,
        title: sound.title,
        category: sound.category,
        duration: sound.duration,
        file_path: sound.file_path,
        thumbnail_path: sound.thumbnail_path,
        created_at: sound.created_at
    }
}