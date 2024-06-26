-- CreateTable
CREATE TABLE "_EpisodeToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EpisodeToUser_AB_unique" ON "_EpisodeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_EpisodeToUser_B_index" ON "_EpisodeToUser"("B");

-- AddForeignKey
ALTER TABLE "_EpisodeToUser" ADD CONSTRAINT "_EpisodeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EpisodeToUser" ADD CONSTRAINT "_EpisodeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
