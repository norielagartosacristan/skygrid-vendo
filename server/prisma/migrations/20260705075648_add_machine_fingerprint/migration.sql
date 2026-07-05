/*
  Warnings:

  - A unique constraint covering the columns `[fingerprint]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fingerprint` to the `Machine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "fingerprint" TEXT NOT NULL,
ADD COLUMN     "hostname" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Machine_fingerprint_key" ON "Machine"("fingerprint");
