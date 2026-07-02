-- CreateTable
CREATE TABLE "NetworkGeneral" (
    "id" TEXT NOT NULL,
    "systemName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "supportEmail" TEXT,
    "supportPhone" TEXT,
    "machinePrefix" TEXT NOT NULL,
    "voucherPrefix" TEXT NOT NULL,
    "autoRestart" BOOLEAN NOT NULL DEFAULT true,
    "primaryDNS" TEXT NOT NULL,
    "secondaryDNS" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkGeneral_pkey" PRIMARY KEY ("id")
);
