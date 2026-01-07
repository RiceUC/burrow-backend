import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Ensure upload directories exist
const uploadsDir = './uploads'
const soundsDir = path.join(uploadsDir, 'sounds')
const thumbnailsDir = path.join(uploadsDir, 'thumbnails')

;[uploadsDir, soundsDir, thumbnailsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
})

// Configure storage for audio files
const soundStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, soundsDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, `sound-${uniqueSuffix}${ext}`)
    }
})

// Configure storage for thumbnails
const thumbnailStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, thumbnailsDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, `thumb-${uniqueSuffix}${ext}`)
    }
})

// File filter for audio
const audioFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = /mp3|wav|m4a|ogg|flac/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
        return cb(null, true)
    }
    cb(new Error('Only audio files are allowed (mp3, wav, m4a, ogg, flac)'))
}

// File filter for images
const imageFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
        return cb(null, true)
    }
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'))
}

// Upload middleware for sound files
export const uploadSound = multer({
    storage: soundStorage,
    fileFilter: audioFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    }
}).single('sound')

// Upload middleware for thumbnails
export const uploadThumbnail = multer({
    storage: thumbnailStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
}).single('thumbnail')

// Upload both sound and thumbnail
export const uploadSoundWithThumbnail = multer({
    storage: soundStorage,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
}).fields([
    { name: 'sound', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
])