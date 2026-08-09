import prisma from "../config/prisma";
import { execSync } from "child_process";
import { detectInterfaces } from "./networkEngine.service";

function linuxInterfaceExists(
    interfaceName: string
): boolean {

    try {

        execSync(
            `ip link show ${interfaceName}`,
            {
                stdio: "ignore"
            }
        );

        return true;

    } catch {

        return false;

    }

}

async function restoreVlanInterface(
    networkInterface: any
) {

    if (
        networkInterface.type !== "VLAN" ||
        !networkInterface.enabled
    ) {

        return;

    }

    const parentInterface =
        networkInterface.parentInterface;

    const vlanId =
        networkInterface.vlanId;

    const interfaceName =
        networkInterface.name;

    if (
        !parentInterface ||
        !vlanId ||
        !interfaceName
    ) {

        console.log(
            `⚠️ Invalid VLAN configuration: ${interfaceName}`
        );

        return;

    }

    /*
     * Check kung existing na sa Linux
     */
    if (
        linuxInterfaceExists(
            interfaceName
        )
    ) {

        console.log(
            `✅ VLAN already exists: ${interfaceName}`
        );

        return;

    }

    console.log(
        `🔧 Restoring VLAN ${interfaceName} (ID ${vlanId})`
    );

    try {

        /*
         * Create VLAN
         */
        execSync(
            `ip link add link ${parentInterface} name ${interfaceName} type vlan id ${vlanId}`
        );

        /*
         * Assign IPv4
         */
        if (
            networkInterface.ipAddress
        ) {

            execSync(
                `ip addr add ${networkInterface.ipAddress}/24 dev ${interfaceName}`
            );

        }

        /*
         * Bring interface UP
         */
        execSync(
            `ip link set ${interfaceName} up`
        );

        console.log(
            `✅ VLAN restored: ${interfaceName}`
        );

    } catch (error) {

        console.error(
            `❌ Failed to restore VLAN ${interfaceName}:`,
            error
        );

    }

}

async function restoreConfiguredInterfaces() {

    const interfaces =
        await prisma.networkInterface.findMany({

            where: {
                type: "VLAN",
                enabled: true
            },

            orderBy: {
                vlanId: "asc"
            }

        });

    for (
        const networkInterface
        of interfaces
    ) {

        await restoreVlanInterface(
            networkInterface
        );

    }

}

export async function autoProvision() {

    /*
     * Existing WAN auto-provision
     */
    const interfaces =
        detectInterfaces();

    for (
        const item
        of interfaces
    ) {

        const existing =
            await prisma.networkInterface.findFirst({

                where: {
                    name: item.name
                }

            });

        if (existing) {

            continue;

        }

        await prisma.networkInterface.create({

            data: {

                name:
                    item.name,

                displayName:
                    "Internet",

                role:
                    "WAN",

                type:
                    "ETHERNET",

                enabled:
                    true,

                ipMode:
                    "DHCP",

                ipAddress:
                    item.ipAddress,

                subnetMask:
                    item.subnetMask

            }

        });

        console.log(
            "Imported:",
            item.name
        );

    }

    /*
     * Restore VLANs from database
     */
    await restoreConfiguredInterfaces();

}