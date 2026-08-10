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

    // ========================================
    // VLAN AUTO CONFIGURATION
    // ========================================

    if (data.type === "VLAN") {

        if (!data.parentInterface) {
            throw new Error(
                "Parent interface is required."
            );
        }

        if (!data.vlanId) {
            throw new Error(
                "VLAN ID is required."
            );
        }

        const vlanId = Number(data.vlanId);

        if (
            vlanId < 1 ||
            vlanId > 4094
        ) {
            throw new Error(
                "VLAN ID must be between 1 and 4094."
            );
        }

        data.name =
            `${data.parentInterface}.${vlanId}`;

        data.displayName =
            `VLAN${vlanId}`;

        data.role = "LAN";

        data.ipMode = "STATIC";

        // VLAN 22 = captive portal network
        // Other VLANs = own subnet
        data.ipAddress =
            vlanId === 22
                ? "10.0.0.1"
                : `10.0.${vlanId}.1`;

        data.subnetMask =
            "255.255.255.0";

    }

    // ========================================
    // SAVE TO DATABASE
    // ========================================

    const networkInterface =
        await prisma.networkInterface.create({
            data,
        });

    // ========================================
    // CREATE VLAN IN LINUX
    // ========================================

    if (data.type === "VLAN") {

        const interfaceName =
            data.name;

        try {

            console.log(
                `🔧 Creating VLAN ${data.vlanId}...`
            );

            execSync(
                `ip link add link ${data.parentInterface} name ${interfaceName} type vlan id ${data.vlanId}`
            );

            execSync(
                `ip addr add ${data.ipAddress}/24 dev ${interfaceName}`
            );

            execSync(
                `ip link set ${interfaceName} up`
            );

            console.log(
                `✅ VLAN created: ${interfaceName}`
            );

            console.log(
                `   IP: ${data.ipAddress}/24`
            );

        } catch (err) {

            console.error(
                "❌ VLAN creation failed:",
                err
            );

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