-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "isPaused" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pausedAt" TIMESTAMP(3),
ADD COLUMN     "remainingSeconds" INTEGER;
