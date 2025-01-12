/*
  Warnings:

  - The primary key for the `BingoGame` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `BingoGame` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `BingoGame` table. All the data in the column will be lost.
  - The required column `id` was added to the `BingoGame` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `gameboards` on the `BingoGame` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `matchHistory` on the `BingoGame` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `totalMatches` on table `BingoProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `wins` on table `BingoProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `losses` on table `BingoProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lines_count` on table `BingoProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstBlood_count` on table `BingoProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `doubleKill_count` on table `BingoProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tripleKill_count` on table `BingoProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `perfectionist_count` on table `BingoProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rampage_count` on table `BingoProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `league` on table `BingoProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mmr` on table `BingoProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_GamePlayers" DROP CONSTRAINT "_GamePlayers_A_fkey";

-- DropIndex
DROP INDEX "BingoGame_gameId_key";

-- AlterTable
ALTER TABLE "BingoGame" DROP CONSTRAINT "BingoGame_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "gameId",
ADD COLUMN     "id" TEXT NOT NULL,
DROP COLUMN "gameboards",
ADD COLUMN     "gameboards" JSONB NOT NULL,
DROP COLUMN "matchHistory",
ADD COLUMN     "matchHistory" JSONB NOT NULL,
ADD CONSTRAINT "BingoGame_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BingoProfile" ALTER COLUMN "totalMatches" SET NOT NULL,
ALTER COLUMN "wins" SET NOT NULL,
ALTER COLUMN "losses" SET NOT NULL,
ALTER COLUMN "lines_count" SET NOT NULL,
ALTER COLUMN "firstBlood_count" SET NOT NULL,
ALTER COLUMN "doubleKill_count" SET NOT NULL,
ALTER COLUMN "tripleKill_count" SET NOT NULL,
ALTER COLUMN "perfectionist_count" SET NOT NULL,
ALTER COLUMN "rampage_count" SET NOT NULL,
ALTER COLUMN "league" SET NOT NULL,
ALTER COLUMN "mmr" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "_GamePlayers" ADD CONSTRAINT "_GamePlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "BingoGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
