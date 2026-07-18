import prisma from "../config/prisma";
import { execSync } from "child_process";

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

export async function createInterface(data: any) {

  // 1. SAVE SA DATABASE MUNA
  const networkInterface = await prisma.networkInterface.create({
    data,
  });

  // 2. VLAN LOGIC (LINUX LEVEL)
  if (data.type === "VLAN") {

    const interfaceName =
      `${data.parentInterface}.${data.vlanId}`;

    try {
      execSync(
        `ip link add link ${data.parentInterface} name ${interfaceName} type vlan id ${data.vlanId}`
      );

      execSync(
        `ip addr add ${data.ipAddress}/${data.subnetMask === "255.255.255.0" ? 24 : 24} dev ${interfaceName}`
      );

      execSync(
        `ip link set ${interfaceName} up`
      );

    } catch (err) {
      console.log("VLAN creation failed:", err);
    }
  }

  return networkInterface;
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

export async function getAssignableInterfaces() {

    return prisma.networkInterface.findMany({

        where: {
            role: "LAN",
            enabled: true
        },

        orderBy: {
            displayName: "asc"
        }

    });

}