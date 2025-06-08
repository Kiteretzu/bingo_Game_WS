/*
  Warnings:

  - A unique constraint covering the columns `[player2Id,player1Id]` on the table `BingoPlayerRecords` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user2Id,user1Id]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "BingoGameHistory" (
    "id" TEXT NOT NULL,
    "bingoProfileId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BingoGameHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BingoGameHistory_bingoProfileId_idx" ON "BingoGameHistory"("bingoProfileId");

-- CreateIndex
CREATE INDEX "BingoGameHistory_gameId_idx" ON "BingoGameHistory"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "BingoPlayerRecords_player2Id_player1Id_key" ON "BingoPlayerRecords"("player2Id", "player1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_user2Id_user1Id_key" ON "Friendship"("user2Id", "user1Id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "BingoGameHistory" ADD CONSTRAINT "BingoGameHistory_bingoProfileId_fkey" FOREIGN KEY ("bingoProfileId") REFERENCES "BingoProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BingoGameHistory" ADD CONSTRAINT "BingoGameHistory_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "BingoGame"("gameId") ON DELETE RESTRICT ON UPDATE CASCADE;
