/*
  Warnings:

  - A unique constraint covering the columns `[fileId]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileId` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "fileId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Episode_fileId_key" ON "Episode"("fileId");

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
