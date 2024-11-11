/*
  Warnings:

  - You are about to drop the column `category` on the `Episode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "category",
ADD COLUMN     "categories" "Category"[] DEFAULT ARRAY[]::"Category"[];
