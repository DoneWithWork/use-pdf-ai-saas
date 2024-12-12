/*
  Warnings:

  - You are about to drop the column `folderId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `File` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_folderId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_workspaceId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "folderId",
DROP COLUMN "workspaceId",
ADD COLUMN     "foldersId" TEXT;

-- CreateTable
CREATE TABLE "_FileWorkspaces" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FileWorkspaces_AB_unique" ON "_FileWorkspaces"("A", "B");

-- CreateIndex
CREATE INDEX "_FileWorkspaces_B_index" ON "_FileWorkspaces"("B");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_foldersId_fkey" FOREIGN KEY ("foldersId") REFERENCES "Folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileWorkspaces" ADD CONSTRAINT "_FileWorkspaces_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileWorkspaces" ADD CONSTRAINT "_FileWorkspaces_B_fkey" FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
