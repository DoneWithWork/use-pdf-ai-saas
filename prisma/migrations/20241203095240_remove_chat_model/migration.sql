/*
  Warnings:

  - You are about to drop the column `chatId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_chatId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "chatId";

-- DropTable
DROP TABLE "Chat";
