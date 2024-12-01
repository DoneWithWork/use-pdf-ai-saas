/*
  Warnings:

  - The `vectorStatus` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VectorStatus" AS ENUM ('PENDING', 'PROCESSING', 'FAILED', 'SUCCESS');

-- AlterTable
ALTER TABLE "File" DROP COLUMN "vectorStatus",
ADD COLUMN     "vectorStatus" "VectorStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "vectorStatus";
