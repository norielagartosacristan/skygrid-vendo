/*
  Warnings:

  - You are about to drop the column `subVendoId` on the `Machine` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[machineId]` on the table `SubVendo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_subVendoId_fkey";

-- AlterTable
ALTER TABLE "Machine" DROP COLUMN "subVendoId";

-- AlterTable
ALTER TABLE "SubVendo" ADD COLUMN     "machineId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SubVendo_machineId_key" ON "SubVendo"("machineId");

-- AddForeignKey
ALTER TABLE "SubVendo" ADD CONSTRAINT "SubVendo_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
