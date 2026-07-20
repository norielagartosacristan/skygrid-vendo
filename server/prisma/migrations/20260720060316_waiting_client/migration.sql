-- CreateTable
CREATE TABLE "WaitingClient" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "clientIP" TEXT NOT NULL,
    "clientMac" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitingClient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WaitingClient" ADD CONSTRAINT "WaitingClient_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
