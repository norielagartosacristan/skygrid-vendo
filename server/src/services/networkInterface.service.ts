import prisma from "../config/prisma";

export async function getInterfaces() {
  return prisma.networkInterface.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getInterface(id: string) {
  return prisma.networkInterface.findUnique({
    where: { id },
  });
}

export async function createInterface(data: {
  name: string;
  displayName: string;
  type: string;
  enabled: boolean;
  ipMode: string;
  ipAddress?: string;
  subnetMask?: string;
  gateway?: string;
  dns1?: string;
  dns2?: string;
  mtu: number;
}) {
  return prisma.networkInterface.create({
    data,
  });
}

export async function updateInterface(
  id: string,
  data: {
    name: string;
    displayName: string;
    type: string;
    enabled: boolean;
    ipMode: string;
    ipAddress?: string;
    subnetMask?: string;
    gateway?: string;
    dns1?: string;
    dns2?: string;
    mtu: number;
  }
) {
  return prisma.networkInterface.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteInterface(id: string) {
  return prisma.networkInterface.delete({
    where: {
      id,
    },
  });
}