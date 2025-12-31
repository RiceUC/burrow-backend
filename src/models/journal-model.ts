// Journal Entry Request for create/update
export interface CreateJournalRequest {
    user_id: number
    content: string
    mood: 'happy' | 'sad' | 'tired' | 'angry'
}

export interface UpdateJournalRequest {
    content?: string
    mood?: 'happy' | 'sad' | 'tired' | 'angry'
}

// Journal Entry Response
export interface JournalResponse {
    journal_id: number
    user_id: number
    content: string
    mood: 'happy' | 'sad' | 'tired' | 'angry'
    created_at: Date
}

// Journal Entry with user details
export interface JournalWithUserResponse extends JournalResponse {
    username: string
    name: string
}

// Convert Prisma journal to response
export function toJournalResponse(journal: any): JournalResponse {
    return {
        journal_id: journal.journal_id,
        user_id: journal.user_id,
        content: journal.content,
        mood: journal.mood,
        created_at: journal.created_at
    }
}

// Convert Prisma journal with user to response
export function toJournalWithUserResponse(journal: any): JournalWithUserResponse {
    return {
        journal_id: journal.journal_id,
        user_id: journal.user_id,
        content: journal.content,
        mood: journal.mood,
        created_at: journal.created_at,
        username: journal.user.username,
        name: journal.user.name
    }
}
