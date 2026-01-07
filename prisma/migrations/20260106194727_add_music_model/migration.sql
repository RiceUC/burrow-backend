-- CreateEnum
CREATE TYPE "MusicCategory" AS ENUM ('BEFORE_SLEEP', 'AFTER_SLEEP');

-- CreateTable
CREATE TABLE "Music" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "category" "MusicCategory" NOT NULL,
    "duration" TEXT NOT NULL,

    CONSTRAINT "Music_pkey" PRIMARY KEY ("id")
);
