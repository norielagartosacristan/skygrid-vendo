-- CreateTable
CREATE TABLE "Bridge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bridge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BridgeMember" (
    "id" TEXT NOT NULL,
    "bridgeId" TEXT NOT NULL,
    "interface" TEXT NOT NULL,

    CONSTRAINT "BridgeMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent" TEXT NOT NULL,
    "bridgeId" TEXT,
    "vlanId" INTEGER NOT NULL,
    "gateway" TEXT NOT NULL,
    "subnetMask" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "portal" TEXT,
    "dhcp" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bridge_name_key" ON "Bridge"("name");

-- AddForeignKey
ALTER TABLE "BridgeMember" ADD CONSTRAINT "BridgeMember_bridgeId_fkey" FOREIGN KEY ("bridgeId") REFERENCES "Bridge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vlan" ADD CONSTRAINT "Vlan_bridgeId_fkey" FOREIGN KEY ("bridgeId") REFERENCES "Bridge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
