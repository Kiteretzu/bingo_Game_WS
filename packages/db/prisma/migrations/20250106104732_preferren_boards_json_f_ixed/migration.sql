/*
  Warnings:

  - The `preferredBoards` column on the `BingoProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BingoProfile" DROP COLUMN "preferredBoards",
ADD COLUMN     "preferredBoards" JSONB[];
