/*
  Warnings:

  - You are about to drop the column `fileId` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `audioFileId` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageId` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageId` to the `Podcast` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_fileId_fkey";

-- DropIndex
DROP INDEX "Episode_fileId_key";

-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "fileId",
ADD COLUMN     "audioFileId" TEXT NOT NULL,
ADD COLUMN     "imageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Podcast" ADD COLUMN     "imageId" TEXT NOT NULL;

-- DropTable
DROP TABLE "File";

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioFile" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Podcast" ADD CONSTRAINT "Podcast_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_audioFileId_fkey" FOREIGN KEY ("audioFileId") REFERENCES "AudioFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
