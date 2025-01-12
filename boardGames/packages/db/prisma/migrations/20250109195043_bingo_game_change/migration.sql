/*
  Warnings:

  - The primary key for the `BingoGame` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BingoGame` table. All the data in the column will be lost.
  - The `gameboards` column on the `BingoGame` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The required column `gameId` was added to the `BingoGame` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "_GamePlayers" DROP CONSTRAINT "_GamePlayers_A_fkey";

-- AlterTable
ALTER TABLE "BingoGame" DROP CONSTRAINT "BingoGame_pkey",
DROP COLUMN "id",
ADD COLUMN     "gameId" TEXT NOT NULL,
DROP COLUMN "gameboards",
ADD COLUMN     "gameboards" JSONB[],
ADD CONSTRAINT "BingoGame_pkey" PRIMARY KEY ("gameId");

-- AddForeignKey
ALTER TABLE "_GamePlayers" ADD CONSTRAINT "_GamePlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "BingoGame"("gameId") ON DELETE CASCADE ON UPDATE CASCADE;
