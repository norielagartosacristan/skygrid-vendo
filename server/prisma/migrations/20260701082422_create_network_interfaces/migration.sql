/*
  Warnings:

  - You are about to drop the column `description` on the `NetworkInterface` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `NetworkInterface` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `NetworkInterface` table. All the data in the column will be lost.
  - Added the required column `displayName` to the `NetworkInterface` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ipMode` to the `NetworkInterface` table without a default value. This is not possible if the table is not empty.
  - Made the column `mtu` on table `NetworkInterface` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "NetworkInterface" DROP COLUMN "description",
DROP COLUMN "mode",
DROP COLUMN "role",
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "ipMode" TEXT NOT NULL,
ALTER COLUMN "mtu" SET NOT NULL;
