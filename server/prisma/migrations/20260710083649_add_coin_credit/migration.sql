-- CreateTable
CREATE TABLE "CoinCredit" (
    "id" TEXT NOT NULL,
    "clientMac" TEXT NOT NULL,
    "clientIP" TEXT NOT NULL,
    "credit" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoinCredit_pkey" PRIMARY KEY ("id")
);
