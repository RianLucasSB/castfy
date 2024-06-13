/*
  Warnings:

  - You are about to drop the `_FavoritesUserEpisodes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FavoritesUserEpisodes" DROP CONSTRAINT "_FavoritesUserEpisodes_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavoritesUserEpisodes" DROP CONSTRAINT "_FavoritesUserEpisodes_B_fkey";

-- DropTable
DROP TABLE "_FavoritesUserEpisodes";

-- CreateTable
CREATE TABLE "FavoritesEpisodesOnUsers" (
    "userId" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,

    CONSTRAINT "FavoritesEpisodesOnUsers_pkey" PRIMARY KEY ("userId","episodeId")
);

-- AddForeignKey
ALTER TABLE "FavoritesEpisodesOnUsers" ADD CONSTRAINT "FavoritesEpisodesOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritesEpisodesOnUsers" ADD CONSTRAINT "FavoritesEpisodesOnUsers_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
