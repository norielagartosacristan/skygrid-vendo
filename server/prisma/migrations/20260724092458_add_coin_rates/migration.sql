/*
  Warnings:

  - You are about to drop the column `machineId` on the `SubVendo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubVendo" DROP CONSTRAINT "SubVendo_machineId_fkey";

-- AlterTable
ALTER TABLE "SubVendo" DROP COLUMN "machineId";

-- CreateTable
CREATE TABLE "CoinRate" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "duration" INTEGER NOT NULL,
    "durationUnit" "DurationUnit" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoinRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoinRate_amount_key" ON "CoinRate"("amount");
