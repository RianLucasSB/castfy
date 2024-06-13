/*
  Warnings:

  - You are about to drop the `_EpisodeToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EpisodeToUser" DROP CONSTRAINT "_EpisodeToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_EpisodeToUser" DROP CONSTRAINT "_EpisodeToUser_B_fkey";

-- DropTable
DROP TABLE "_EpisodeToUser";

-- CreateTable
CREATE TABLE "_FavoritesUserEpisodes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoritesUserEpisodes_AB_unique" ON "_FavoritesUserEpisodes"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoritesUserEpisodes_B_index" ON "_FavoritesUserEpisodes"("B");

-- AddForeignKey
ALTER TABLE "_FavoritesUserEpisodes" ADD CONSTRAINT "_FavoritesUserEpisodes_A_fkey" FOREIGN KEY ("A") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoritesUserEpisodes" ADD CONSTRAINT "_FavoritesUserEpisodes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
