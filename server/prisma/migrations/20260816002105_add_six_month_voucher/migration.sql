/*
  Warnings:

  - A unique constraint covering the columns `[machineId]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `machineId` to the `Machine` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SubVendo_machineId_key";

-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "machineId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN     "activatedAt" TIMESTAMP(3),
ADD COLUMN     "boundClientMac" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "validityType" TEXT NOT NULL DEFAULT 'REGULAR';

-- CreateIndex
CREATE UNIQUE INDEX "Machine_machineId_key" ON "Machine"("machineId");
