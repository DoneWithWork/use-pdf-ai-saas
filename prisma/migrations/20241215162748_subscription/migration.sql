/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Plans" AS ENUM ('FREE', 'STUDENT', 'PRO');

-- CreateEnum
CREATE TYPE "SubscriptionPeriod" AS ENUM ('MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "plan" "Plans" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "subscriptionId" TEXT;

-- AlterTable
ALTER TABLE "_FileWorkspaces" ADD CONSTRAINT "_FileWorkspaces_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FileWorkspaces_AB_unique";

-- CreateTable
CREATE TABLE "Subscription" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "Plans" NOT NULL,
    "period" "SubscriptionPeriod" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_customerId_key" ON "User"("customerId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
