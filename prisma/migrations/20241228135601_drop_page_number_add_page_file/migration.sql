/*
  Warnings:

  - You are about to drop the column `fileId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `pageNumbers` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_fileId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "fileId",
DROP COLUMN "pageNumbers";

-- CreateTable
CREATE TABLE "PageFile" (
    "id" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "fileId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FileToMessage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FileToMessage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageFile_pageNumber_fileId_messageId_key" ON "PageFile"("pageNumber", "fileId", "messageId");

-- CreateIndex
CREATE INDEX "_FileToMessage_B_index" ON "_FileToMessage"("B");

-- AddForeignKey
ALTER TABLE "PageFile" ADD CONSTRAINT "PageFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageFile" ADD CONSTRAINT "PageFile_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToMessage" ADD CONSTRAINT "_FileToMessage_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToMessage" ADD CONSTRAINT "_FileToMessage_B_fkey" FOREIGN KEY ("B") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
