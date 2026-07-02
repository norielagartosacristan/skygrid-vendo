-- CreateTable
CREATE TABLE "SubVendo" (
    "id" TEXT NOT NULL,
    "chipId" TEXT NOT NULL,
    "macAddress" TEXT NOT NULL,
    "firmwareVersion" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "machineName" TEXT,
    "parentInterface" TEXT,
    "vlanId" INTEGER,
    "ipMode" TEXT,
    "ipAddressStatic" TEXT,
    "subnetMask" TEXT,
    "gateway" TEXT,
    "dns1" TEXT,
    "dns2" TEXT,
    "clientStartIp" INTEGER,
    "clientEndIp" INTEGER,
    "bandwidthProfile" TEXT,
    "portal" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubVendo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubVendo_chipId_key" ON "SubVendo"("chipId");

-- CreateIndex
CREATE UNIQUE INDEX "SubVendo_macAddress_key" ON "SubVendo"("macAddress");
