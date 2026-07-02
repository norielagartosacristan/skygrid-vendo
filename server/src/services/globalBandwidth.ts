import prisma from "../config/prisma";

export async function getSettings() {
  return prisma.globalBandwidth.findFirst();
}

export async function saveSettings(data: {
  downloadSpeed: number;
  uploadSpeed: number;

  reserveDownload: number;
  reserveUpload: number;

  burstEnabled: boolean;

  burstDownload: number;
  burstUpload: number;

  burstDuration: number;

  mode: string;
}) {
  const existing = await prisma.globalBandwidth.findFirst();

  if (existing) {
    return prisma.globalBandwidth.update({
      where: {
        id: existing.id,
      },
      data,
    });
  }

  return prisma.globalBandwidth.create({
    data,
  });
}