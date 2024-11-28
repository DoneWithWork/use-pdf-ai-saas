-- CreateEnum
CREATE TYPE "vectorStatus" AS ENUM ('PENDING', 'PROCESSING', 'FAILED', 'SUCCESS');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "vectorStatus" "vectorStatus" NOT NULL DEFAULT 'PENDING';
