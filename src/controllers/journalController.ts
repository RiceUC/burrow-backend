import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. CREATE: Bikin Jurnal Baru
export const createJournal = async (req: Request, res: Response) => {
  try {
    // Title udah gak ada. Sekarang kita terima 'date'.
    const { content, mood, date, userId } = req.body;

    // Validasi input
    if (!content || !mood || !date || !userId) {
        return res.status(400).json({ 
            message: "Data tidak lengkap! Content, Mood, Date, dan UserId wajib diisi." 
        });
    }

    // Validasi User
    const userExists = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
    });
    if (!userExists) {
        return res.status(404).json({ message: "User tidak ditemukan!" });
    }

    const newJournal = await prisma.journal.create({
      data: {
        content: content,
        mood: mood, // Prisma otomatis cek apakah ini HAPPY/SAD/TIRED/ANGRY
        date: new Date(date), // Convert string "2025-12-10" jadi Format Date DB
        userId: parseInt(userId),
      },
    });

    res.status(201).json({ 
        message: "Jurnal berhasil disimpan!", 
        data: newJournal 
    });

  } catch (error) {
    console.error(error); 
    // Kalau mood yang dikirim bukan salah satu dari 4 enum, errornya bakal ketangkap disini
    res.status(500).json({ message: "Gagal menyimpan jurnal (Cek format Date/Mood)", error });
  }
};

// 2. READ: Ambil semua jurnal milik user tertentu
export const getJournalsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // Ambil ID dari URL (misal: /journals/1)

    // Convert string "1" jadi integer 1
    const userIdInt = parseInt(userId || "0");

    const journals = await prisma.journal.findMany({
      where: {
        userId: userIdInt // Filter cuma punya user ini
      },
      orderBy: {
        date: 'desc' // Urutkan dari yang paling baru
      }
    });

    res.json({ data: journals });

  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error });
  }
};

// 3. UPDATE: Edit Jurnal
export const updateJournal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // HAPUS 'title' dari sini karena tabel udah gak punya kolom title
    const { content, mood, date } = req.body; 

    const updatedJournal = await prisma.journal.update({
      // FIX 1: Tambahkan || "0" biar TypeScript gak rewel
      where: { id: parseInt(id || "0") }, 
      data: {
        // HAPUS 'title' dari sini juga
        content: content,
        mood: mood,
        date: new Date(date)
      }
    });

    res.json({ message: "Jurnal berhasil diupdate!", data: updatedJournal });
  } catch (error) {
    res.status(500).json({ message: "Gagal update (Mungkin ID salah)", error });
  }
};

// 4. DELETE: Hapus Jurnal
export const deleteJournal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.journal.delete({
      where: { id: parseInt(id || "0") }
    });

    res.json({ message: "Jurnal berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal hapus (Mungkin ID salah)", error });
  }
};


// 5. GET: Ambil single journal by ID (BARU)
export const getJournalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const journal = await prisma.journal.findUnique({
      where: { id: parseInt(id || "0") }
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal tidak ditemukan!" });
    }

    res.json({ data: journal });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil journal", error });
  }
};
