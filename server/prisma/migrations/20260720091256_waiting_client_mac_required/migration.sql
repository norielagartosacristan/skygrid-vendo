/*
  Warnings:

  - Made the column `clientMac` on table `WaitingClient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WaitingClient" ALTER COLUMN "clientMac" SET NOT NULL;
