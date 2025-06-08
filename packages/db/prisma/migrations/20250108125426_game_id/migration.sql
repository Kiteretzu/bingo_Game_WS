/*
  Warnings:

  - The primary key for the `BingoGame` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BingoGame` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId]` on the table `BingoGame` will be added. If there are existing duplicate values, this will fail.
  - The required column `gameId` was added to the `BingoGame` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "_GamePlayers" DROP CONSTRAINT "_GamePlayers_A_fkey";

-- DropIndex
DROP INDEX "BingoGame_id_key";

-- AlterTable
ALTER TABLE "BingoGame" DROP CONSTRAINT "BingoGame_pkey",
DROP COLUMN "id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gameId" TEXT NOT NULL,
ADD CONSTRAINT "BingoGame_pkey" PRIMARY KEY ("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "BingoGame_gameId_key" ON "BingoGame"("gameId");

-- AddForeignKey
ALTER TABLE "_GamePlayers" ADD CONSTRAINT "_GamePlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "BingoGame"("gameId") ON DELETE CASCADE ON UPDATE CASCADE;
