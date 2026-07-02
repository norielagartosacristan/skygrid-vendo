/*
  Warnings:

  - You are about to drop the column `burstDownload` on the `ClientControl` table. All the data in the column will be lost.
  - You are about to drop the column `burstTime` on the `ClientControl` table. All the data in the column will be lost.
  - You are about to drop the column `burstUpload` on the `ClientControl` table. All the data in the column will be lost.
  - Added the required column `idleTimeout` to the `ClientControl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxClients` to the `ClientControl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `queueType` to the `ClientControl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reconnectDelay` to the `ClientControl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionTimeout` to the `ClientControl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ClientControl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientControl" DROP COLUMN "burstDownload",
DROP COLUMN "burstTime",
DROP COLUMN "burstUpload",
ADD COLUMN     "autoDisconnect" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deviceIsolation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "idleTimeout" INTEGER NOT NULL,
ADD COLUMN     "macLock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxClients" INTEGER NOT NULL,
ADD COLUMN     "queueType" TEXT NOT NULL,
ADD COLUMN     "reconnectDelay" INTEGER NOT NULL,
ADD COLUMN     "sessionTimeout" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
