/*
  Warnings:

  - You are about to drop the column `download` on the `GlobalBandwidth` table. All the data in the column will be lost.
  - You are about to drop the column `reserveBandwidth` on the `GlobalBandwidth` table. All the data in the column will be lost.
  - You are about to drop the column `upload` on the `GlobalBandwidth` table. All the data in the column will be lost.
  - Added the required column `burstDownload` to the `GlobalBandwidth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `burstDuration` to the `GlobalBandwidth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `burstUpload` to the `GlobalBandwidth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `downloadSpeed` to the `GlobalBandwidth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `GlobalBandwidth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reserveDownload` to the `GlobalBandwidth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reserveUpload` to the `GlobalBandwidth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GlobalBandwidth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadSpeed` to the `GlobalBandwidth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GlobalBandwidth" DROP COLUMN "download",
DROP COLUMN "reserveBandwidth",
DROP COLUMN "upload",
ADD COLUMN     "burstDownload" INTEGER NOT NULL,
ADD COLUMN     "burstDuration" INTEGER NOT NULL,
ADD COLUMN     "burstEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "burstUpload" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "downloadSpeed" INTEGER NOT NULL,
ADD COLUMN     "mode" TEXT NOT NULL,
ADD COLUMN     "reserveDownload" INTEGER NOT NULL,
ADD COLUMN     "reserveUpload" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "uploadSpeed" INTEGER NOT NULL;
