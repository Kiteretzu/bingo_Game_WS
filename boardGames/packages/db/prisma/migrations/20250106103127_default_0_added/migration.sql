/*
  Warnings:

  - Added the required column `displayName` to the `BingoProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BingoProfile" ADD COLUMN     "displayName" TEXT NOT NULL,
ALTER COLUMN "totalMatches" SET DEFAULT 0,
ALTER COLUMN "wins" SET DEFAULT 0,
ALTER COLUMN "losses" SET DEFAULT 0,
ALTER COLUMN "lines_count" SET DEFAULT 0,
ALTER COLUMN "firstBlood_count" SET DEFAULT 0,
ALTER COLUMN "doubleKill_count" SET DEFAULT 0,
ALTER COLUMN "tripleKill_count" SET DEFAULT 0,
ALTER COLUMN "perfectionist_count" SET DEFAULT 0,
ALTER COLUMN "rampage_count" SET DEFAULT 0,
ALTER COLUMN "mmr" SET DEFAULT 0;
