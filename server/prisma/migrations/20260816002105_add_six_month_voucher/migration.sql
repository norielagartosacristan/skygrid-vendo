/*
  Warnings:

  - A unique constraint covering the columns `[machineId]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `machineId` to the `Machine` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN     "activatedAt" TIMESTAMP(3),
ADD COLUMN     "boundClientMac" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "validityType" TEXT NOT NULL DEFAULT 'REGULAR';

