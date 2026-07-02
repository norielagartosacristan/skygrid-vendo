import prisma from "../config/prisma";

export async function getSettings() {
  return prisma.clientControl.findFirst();
}

export async function saveSettings(data: {
  defaultDownload: number;
  defaultUpload: number;

  maxClients: number;

  idleTimeout: number;
  sessionTimeout: number;

  macLock: boolean;
  deviceIsolation: boolean;
  autoDisconnect: boolean;

  reconnectDelay: number;

  queueType: string;
}) {
  const existing = await prisma.clientControl.findFirst();

  if (existing) {
    return prisma.clientControl.update({
      where: {
        id: existing.id,
      },
      data,
    });
  }

  return prisma.clientControl.create({
    data,
  });
}