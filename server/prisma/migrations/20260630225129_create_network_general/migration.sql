-- CreateTable
CREATE TABLE "NetworkInterface" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "ipAddress" TEXT,
    "subnetMask" TEXT,
    "gateway" TEXT,
    "dns1" TEXT,
    "dns2" TEXT,
    "mtu" INTEGER DEFAULT 1500,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkInterface_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkVlan" (
    "id" TEXT NOT NULL,
    "vlanId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "parentInterface" TEXT NOT NULL,
    "ipAddress" TEXT,
    "subnetMask" TEXT,
    "gateway" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkVlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientControl" (
    "id" TEXT NOT NULL,
    "defaultDownload" INTEGER NOT NULL,
    "defaultUpload" INTEGER NOT NULL,
    "burstDownload" INTEGER,
    "burstUpload" INTEGER,
    "burstTime" INTEGER,

    CONSTRAINT "ClientControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalBandwidth" (
    "id" TEXT NOT NULL,
    "download" INTEGER NOT NULL,
    "upload" INTEGER NOT NULL,
    "reserveBandwidth" INTEGER NOT NULL,

    CONSTRAINT "GlobalBandwidth_pkey" PRIMARY KEY ("id")
);
