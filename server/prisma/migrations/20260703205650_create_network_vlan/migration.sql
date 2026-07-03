/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `NetworkVlan` table. All the data in the column will be lost.
  - You are about to drop the column `parentInterface` on the `NetworkVlan` table. All the data in the column will be lost.
  - You are about to drop the column `subnetMask` on the `NetworkVlan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vlanId]` on the table `NetworkVlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dns` to the `NetworkVlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interface` to the `NetworkVlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subnet` to the `NetworkVlan` table without a default value. This is not possible if the table is not empty.
  - Made the column `gateway` on table `NetworkVlan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "NetworkVlan" DROP COLUMN "ipAddress",
DROP COLUMN "parentInterface",
DROP COLUMN "subnetMask",
ADD COLUMN     "dhcpEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dns" TEXT NOT NULL,
ADD COLUMN     "interface" TEXT NOT NULL,
ADD COLUMN     "internet" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subnet" TEXT NOT NULL,
ALTER COLUMN "gateway" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NetworkVlan_vlanId_key" ON "NetworkVlan"("vlanId");
