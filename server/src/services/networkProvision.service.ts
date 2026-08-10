import prisma from "../config/prisma";
import { execSync } from "child_process";
import { detectInterfaces } from "./networkEngine.service";

function linuxInterfaceExists(interfaceName: string): boolean {
    try {
        execSync(`ip link show ${interfaceName}`, {
            stdio: "ignore",
        });

        return true;
    } catch {
        return false;
    }
}

function subnetMaskToPrefix(subnetMask?: string | null): number {
    if (!subnetMask) {
        return 24;
    }

    const parts = subnetMask.split(".").map(Number);

    if (parts.length !== 4 || parts.some(Number.isNaN)) {
        return 24;
    }

    const binary = parts
        .map((part) => part.toString(2).padStart(8, "0"))
        .join("");

    return binary.split("1").length - 1;
}

function getInterfaceIPv4(interfaceName: string): string | null {
    try {
        const output = execSync(
            `ip -4 -o addr show dev ${interfaceName}`,
            {
                encoding: "utf8",
            }
        );

        const match = output.match(
            /inet\s+([0-9.]+)\/\d+/
        );

        return match?.[1] ?? null;
    } catch {
        return null;
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

    const ipAddress =
        networkInterface.ipAddress;

    const subnetMask =
        networkInterface.subnetMask;

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

    const prefix =
        subnetMaskToPrefix(subnetMask);

    console.log(
        `🔎 Checking VLAN ${interfaceName} (ID ${vlanId})`
    );

    try {

        /*
         * ========================================
         * 1. CREATE VLAN IF NOT EXISTING
         * ========================================
         */

        if (
            !linuxInterfaceExists(
                interfaceName
            )
        ) {

            console.log(
                `🔧 Creating VLAN ${interfaceName}`
            );

            execSync(
                `ip link add link ${parentInterface} name ${interfaceName} type vlan id ${vlanId}`
            );

        } else {

            console.log(
                `✅ VLAN already exists: ${interfaceName}`
            );

        }


        /*
         * ========================================
         * 2. CONFIGURE IPv4
         * ========================================
         */

        if (ipAddress) {

            const currentIP =
                getInterfaceIPv4(
                    interfaceName
                );

            if (currentIP !== ipAddress) {

                /*
                 * Remove existing IPv4 addresses
                 */

                try {

                    execSync(
                        `ip -4 addr flush dev ${interfaceName}`
                    );

                } catch {
                    // Ignore
                }

                /*
                 * Assign configured IP
                 */

                execSync(
                    `ip addr add ${ipAddress}/${prefix} dev ${interfaceName}`
                );

                console.log(
                    `🌐 ${interfaceName} → ${ipAddress}/${prefix}`
                );

            } else {

                console.log(
                    `✅ IPv4 already correct: ${ipAddress}/${prefix}`
                );

            }

        }


        /*
         * ========================================
         * 3. BRING VLAN UP
         * ========================================
         */

        execSync(
            `ip link set ${interfaceName} up`
        );

        console.log(
            `🟢 VLAN UP: ${interfaceName}`
        );

    } catch (error) {

        console.error(
            `❌ Failed to provision VLAN ${interfaceName}:`,
            error
        );

    }
}

async function restoreConfiguredInterfaces() {

    const interfaces =
        await prisma.networkInterface.findMany({

            where: {
                type: "VLAN",
                enabled: true,
            },

            orderBy: {
                vlanId: "asc",
            },

        });

    console.log(
        "🔎 VLANs from database:",
        interfaces.map((v) => ({
            name: v.name,
            vlanId: v.vlanId,
            parent: v.parentInterface,
            enabled: v.enabled,
            ip: v.ipAddress,
            subnetMask: v.subnetMask,
        }))
    );

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
     * ========================================
     * EXISTING WAN AUTO-PROVISION
     * ========================================
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
                    name: item.name,
                },

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
                    item.subnetMask,

            },

        });

        console.log(
            "Imported:",
            item.name
        );

    }


    /*
     * ========================================
     * RESTORE VLANs
     * ========================================
     */

    await restoreConfiguredInterfaces();
}