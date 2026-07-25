-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "subVendoId" TEXT;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_subVendoId_fkey" FOREIGN KEY ("subVendoId") REFERENCES "SubVendo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
