-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "pageNumbers" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
