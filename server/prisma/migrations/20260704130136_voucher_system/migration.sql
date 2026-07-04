/*
  Warnings:

  - You are about to drop the column `downloadSpeed` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `uploadSpeed` on the `Package` table. All the data in the column will be lost.
  - Added the required column `durationUnit` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DurationUnit" AS ENUM ('MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR');

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "downloadSpeed",
DROP COLUMN "uploadSpeed",
ADD COLUMN     "dataLimitMB" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "downloadMbps" INTEGER,
ADD COLUMN     "durationUnit" "DurationUnit" NOT NULL,
ADD COLUMN     "uploadMbps" INTEGER;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Voucher" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "status" "VoucherStatus" NOT NULL DEFAULT 'ACTIVE',
    "sessionId" TEXT,
    "usedByIP" TEXT,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_code_key" ON "Voucher"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_sessionId_key" ON "Voucher"("sessionId");

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
