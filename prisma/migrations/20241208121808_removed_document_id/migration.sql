/*
  Warnings:

  - You are about to drop the column `documentsId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `documentsId` on the `Folders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "documentsId";

-- AlterTable
ALTER TABLE "Folders" DROP COLUMN "documentsId";
