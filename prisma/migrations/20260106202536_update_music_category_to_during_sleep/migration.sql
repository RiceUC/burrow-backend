/*
  Warnings:

  - The values [AFTER_SLEEP] on the enum `MusicCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MusicCategory_new" AS ENUM ('BEFORE_SLEEP', 'DURING_SLEEP');
ALTER TABLE "Music" ALTER COLUMN "category" TYPE "MusicCategory_new" USING ("category"::text::"MusicCategory_new");
ALTER TYPE "MusicCategory" RENAME TO "MusicCategory_old";
ALTER TYPE "MusicCategory_new" RENAME TO "MusicCategory";
DROP TYPE "MusicCategory_old";
COMMIT;
