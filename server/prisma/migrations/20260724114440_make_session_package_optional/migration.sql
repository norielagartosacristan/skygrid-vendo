-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_packageId_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "packageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;
