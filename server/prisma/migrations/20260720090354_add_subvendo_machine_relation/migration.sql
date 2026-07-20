-- AlterTable
ALTER TABLE "SubVendo" ADD COLUMN     "machineId" TEXT;

-- AddForeignKey
ALTER TABLE "SubVendo" ADD CONSTRAINT "SubVendo_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
