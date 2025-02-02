-- AlterTable
ALTER TABLE "BingoGame" ADD COLUMN     "gameEndedAt" TIMESTAMP(3),
ADD COLUMN     "gameLoserId" TEXT,
ADD COLUMN     "loserMMR" INTEGER,
ADD COLUMN     "winMMR" INTEGER;

-- AddForeignKey
ALTER TABLE "BingoGame" ADD CONSTRAINT "BingoGame_gameWinnerId_fkey" FOREIGN KEY ("gameWinnerId") REFERENCES "BingoProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BingoGame" ADD CONSTRAINT "BingoGame_tossWinnerId_fkey" FOREIGN KEY ("tossWinnerId") REFERENCES "BingoProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BingoGame" ADD CONSTRAINT "BingoGame_gameLoserId_fkey" FOREIGN KEY ("gameLoserId") REFERENCES "BingoProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
