/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `NetworkInterface` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "NetworkInterface" ADD COLUMN     "dhcpEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dhcpEnd" TEXT,
ADD COLUMN     "dhcpStart" TEXT,
ADD COLUMN     "parentInterface" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'LAN',
ADD COLUMN     "security" TEXT,
ADD COLUMN     "ssid" TEXT,
ADD COLUMN     "vlanId" INTEGER,
ALTER COLUMN "ipMode" SET DEFAULT 'STATIC';

-- CreateIndex
CREATE UNIQUE INDEX "NetworkInterface_name_key" ON "NetworkInterface"("name");
