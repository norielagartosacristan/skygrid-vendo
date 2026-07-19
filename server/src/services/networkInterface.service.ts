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

  // AUTO GENERATE PARA SA VLAN
  if (data.type === "VLAN") {

    data.name = `${data.parentInterface}.${data.vlanId}`;

    data.displayName = `VLAN${data.vlanId}`;

    data.role = "LAN";

    if (!data.ipMode)
      data.ipMode = "STATIC";

    if (!data.ipAddress)
      data.ipAddress = "10.0.0.1";

    if (!data.subnetMask)
      data.subnetMask = "255.255.255.0";
  }

  // SAVE SA DATABASE
  const networkInterface = await prisma.networkInterface.create({
    data,
  });

  // CREATE VLAN SA LINUX
  if (data.type === "VLAN") {

    const interfaceName = data.name;

    try {

      execSync(
        `ip link add link ${data.parentInterface} name ${interfaceName} type vlan id ${data.vlanId}`
      );

      execSync(
        `ip addr add ${data.ipAddress}/24 dev ${interfaceName}`
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