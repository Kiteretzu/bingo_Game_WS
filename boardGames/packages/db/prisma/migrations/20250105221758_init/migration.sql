-- CreateEnum
CREATE TYPE "Leagues" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'GRANDMASTER');

-- CreateEnum
CREATE TYPE "Win_method" AS ENUM ('RESIGNATION', 'ABANDON', 'BINGO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "displayName" TEXT,
    "email" TEXT,
    "avatar" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BingoProfile" (
    "id" TEXT NOT NULL,
    "totalMatches" INTEGER,
    "wins" INTEGER,
    "losses" INTEGER,
    "lines_count" INTEGER,
    "firstBlood_count" INTEGER,
    "doubleKill_count" INTEGER,
    "tripleKill_count" INTEGER,
    "perfectionist_count" INTEGER,
    "rampage_count" INTEGER,
    "league" "Leagues",
    "mmr" INTEGER,
    "preferredBoards" JSONB[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "BingoProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BingoGame" (
    "id" TEXT NOT NULL,
    "player1Id" TEXT,
    "player2Id" TEXT,
    "gameboards" JSONB[],
    "matchHistory" JSONB[],
    "winMethod" "Win_method",
    "bingoId" TEXT,
    "gameWinnerId" TEXT,
    "tossWinnerId" TEXT,

    CONSTRAINT "BingoGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BingoPlayerRecords" (
    "id" TEXT NOT NULL,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT NOT NULL,
    "ratio" JSONB,
    "bingoProfileId" TEXT,

    CONSTRAINT "BingoPlayerRecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BingoProfile_userId_key" ON "BingoProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BingoGame_id_key" ON "BingoGame"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BingoPlayerRecords_player1Id_player2Id_key" ON "BingoPlayerRecords"("player1Id", "player2Id");

-- AddForeignKey
ALTER TABLE "BingoProfile" ADD CONSTRAINT "BingoProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BingoGame" ADD CONSTRAINT "BingoGame_bingoId_fkey" FOREIGN KEY ("bingoId") REFERENCES "BingoProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BingoPlayerRecords" ADD CONSTRAINT "BingoPlayerRecords_bingoProfileId_fkey" FOREIGN KEY ("bingoProfileId") REFERENCES "BingoProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
