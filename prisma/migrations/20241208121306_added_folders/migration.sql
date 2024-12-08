/*
  Warnings:

  - You are about to drop the `Documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_userId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_documentsId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_documentsId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_userId_fkey";

-- DropTable
DROP TABLE "Documents";

-- DropTable
DROP TABLE "Folder";

-- CreateTable
CREATE TABLE "Folders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "userId" TEXT,
    "documentsId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Folders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
