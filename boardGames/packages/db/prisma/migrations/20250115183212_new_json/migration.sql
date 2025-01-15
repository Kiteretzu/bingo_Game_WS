/*
  Warnings:

  - The `matchHistory` column on the `BingoGame` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BingoGame" DROP COLUMN "matchHistory",
ADD COLUMN     "matchHistory" JSONB[];
