/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `googleId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "BingoProfile" DROP CONSTRAINT "BingoProfile_userId_fkey";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "googleId" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- AddForeignKey
ALTER TABLE "BingoProfile" ADD CONSTRAINT "BingoProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("googleId") ON DELETE RESTRICT ON UPDATE CASCADE;
