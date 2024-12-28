/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `PageFile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PageFile_pageNumber_fileId_messageId_key";

-- CreateIndex
CREATE UNIQUE INDEX "PageFile_messageId_key" ON "PageFile"("messageId");
