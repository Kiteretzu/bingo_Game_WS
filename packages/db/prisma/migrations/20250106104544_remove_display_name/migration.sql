/*
  Warnings:

  - You are about to drop the column `displayName` on the `BingoProfile` table. All the data in the column will be lost.
  - Changed the type of `preferredBoards` on the `BingoProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BingoProfile" DROP COLUMN "displayName",
DROP COLUMN "preferredBoards",
ADD COLUMN     "preferredBoards" JSONB NOT NULL;
