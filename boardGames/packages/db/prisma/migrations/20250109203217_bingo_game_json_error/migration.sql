/*
  Warnings:

  - Changed the type of `gameboards` on the `BingoGame` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BingoGame" DROP COLUMN "gameboards",
ADD COLUMN     "gameboards" JSONB NOT NULL;
