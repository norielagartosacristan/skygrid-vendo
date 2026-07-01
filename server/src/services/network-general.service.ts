import prisma from "../config/prisma";

export async function getSettings() {
  return prisma.networkGeneral.findFirst();
}

export async function saveSettings(data: {
  systemName: string;
  companyName?: string;
  country: string;
  timezone: string;
  currency: string;
  language: string;
  adminEmail?: string;
  supportNumber?: string;
}) {
  const existing = await prisma.networkGeneral.findFirst();

  if (existing) {
    return prisma.networkGeneral.update({
      where: {
        id: existing.id,
      },
      data,
    });
  }

  return prisma.networkGeneral.create({
    data,
  });
}