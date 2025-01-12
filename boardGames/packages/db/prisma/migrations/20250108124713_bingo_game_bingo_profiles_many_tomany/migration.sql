/*
  Warnings:

  - You are about to drop the column `bingoId` on the `BingoGame` table. All the data in the column will be lost.
  - You are about to drop the column `player1Id` on the `BingoGame` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `BingoGame` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BingoGame" DROP CONSTRAINT "BingoGame_bingoId_fkey";

-- AlterTable
ALTER TABLE "BingoGame" DROP COLUMN "bingoId",
DROP COLUMN "player1Id",
DROP COLUMN "player2Id";

-- CreateTable
CREATE TABLE "_GamePlayers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GamePlayers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GamePlayers_B_index" ON "_GamePlayers"("B");

-- AddForeignKey
ALTER TABLE "_GamePlayers" ADD CONSTRAINT "_GamePlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "BingoGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GamePlayers" ADD CONSTRAINT "_GamePlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "BingoProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
