import prisma from "../config/prisma";


export async function registerDevice(data: {
  chipId: string;
  macAddress: string;
  firmwareVersion: string;
  ipAddress: string;
}) {
    console.log("SERVICE DATA:", data);

  const existing = await prisma.subVendo.findUnique({
    where: {
      macAddress: data.macAddress,
    },
  });

  if (existing) {
    return prisma.subVendo.update({
      where: {
        id: existing.id,
      },
      data: {
        firmwareVersion: data.firmwareVersion,
        ipAddress: data.ipAddress,
        lastSeen: new Date(),
      },
    });
  }

  return prisma.subVendo.create({
    data: {
      chipId: data.chipId,
      macAddress: data.macAddress,
      firmwareVersion: data.firmwareVersion,
      ipAddress: data.ipAddress,
      status: "PENDING",
      lastSeen: new Date(),
    },
  });
}

export async function getPendingDevices() {
  return prisma.subVendo.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function configureDevice(
  id: string,
  data: {
    machineName: string;
    parentInterface: string;
    vlanId: number;
    ipMode: string;
    ipAddressStatic: string;
    subnetMask: string;
    gateway: string;
    dns1: string;
    dns2: string;
    clientStartIp: number;
    clientEndIp: number;
    bandwidthProfile: string;
    portal: string;
    enabled: boolean;
  }
) {
  return prisma.subVendo.update({
    where: {
      id,
    },
    data: {
      ...data,
      status: "REGISTERED",
    },
  });
}

export async function getRegisteredDevices() {
  return prisma.subVendo.findMany({
    where: {
      status: "REGISTERED",
    },
    orderBy: {
      machineName: "asc",
    },
  });
}

export async function heartbeat(
  chipId: string,
  data: {
    uptime: number;
    connectedClients: number;
    freeMemory: number;
    wifiSignal: number;
    temperature: number;
  }
) {
  return prisma.subVendo.update({
    where: {
      chipId,
    },
    data: {
      online: true,

      uptime: data.uptime,

      connectedClients: data.connectedClients,

      freeMemory: data.freeMemory,

      wifiSignal: data.wifiSignal,

      temperature: data.temperature,

      lastSeen: new Date(),
    },
  });
}

export async function getConfiguration(chipId: string) {
  return prisma.subVendo.findUnique({
    where: {
      chipId,
    },
    select: {
      chipId: true,

      machineName: true,

      parentInterface: true,

      vlanId: true,

      ipMode: true,

      ipAddressStatic: true,

      subnetMask: true,

      gateway: true,

      dns1: true,

      dns2: true,

      clientStartIp: true,

      clientEndIp: true,

      bandwidthProfile: true,

      portal: true,

      enabled: true,

      status: true,
    },
  });
}