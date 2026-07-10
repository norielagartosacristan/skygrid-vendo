/*
  Warnings:

  - A unique constraint covering the columns `[clientMac]` on the table `CoinCredit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CoinCredit_clientMac_key" ON "CoinCredit"("clientMac");
