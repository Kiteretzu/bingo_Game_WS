/*
  Warnings:

  - You are about to drop the column `bingoProfileId` on the `BingoPlayerRecords` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BingoPlayerRecords" DROP CONSTRAINT "BingoPlayerRecords_bingoProfileId_fkey";

-- AlterTable
ALTER TABLE "BingoPlayerRecords" DROP COLUMN "bingoProfileId";
