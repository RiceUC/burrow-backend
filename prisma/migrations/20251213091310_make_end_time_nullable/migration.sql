-- AlterTable
ALTER TABLE "SleepSession" ALTER COLUMN "end_time" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "reminder_time" SET DATA TYPE TEXT;
