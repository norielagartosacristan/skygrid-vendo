import prisma from "../config/prisma";

interface RegisterSubVendoData {
    chipId: string;
    macAddress: string;
    firmwareVersion: string;
    ipAddress: string;
}

/**
 * Register or update SubVendo.
 *
 * Ang chipId ang unique identity ng SubVendo.
 * Walang machineId na kailangan sa registration.
 */
export async function registerDevice(
    data: RegisterSubVendoData
) {
    console.log("========== SUBVENDO REGISTER ==========");
    console.log("Chip ID:", data.chipId);
    console.log("MAC:", data.macAddress);
    console.log("IP:", data.ipAddress);
    console.log("Firmware:", data.firmwareVersion);
    console.log("=======================================");

    const existing =
        await prisma.subVendo.findUnique({
            where: {
                chipId: data.chipId,
            },
        });

    /**
     * Existing SubVendo
     *
     * Update lang ang dynamic information.
     */
    if (existing) {

        return prisma.subVendo.update({
            where: {
                chipId: data.chipId,
            },

            data: {
                macAddress:
                    data.macAddress,

                firmwareVersion:
                    data.firmwareVersion,

                ipAddress:
                    data.ipAddress,

                lastSeen:
                    new Date(),

                online:
                    true,
            },
        });
    }

    /**
     * New SubVendo
     *
     * Automatic registration.
     * Walang machineId.
     */
    return prisma.subVendo.create({
        data: {
            chipId:
                data.chipId,

            macAddress:
                data.macAddress,

            firmwareVersion:
                data.firmwareVersion,

            ipAddress:
                data.ipAddress,

            status:
                "PENDING",

            enabled:
                false,

            online:
                true,

            lastSeen:
                new Date(),
        },
    });
}


/**
 * Get all pending SubVendo devices.
 */
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


/**
 * Configure / approve SubVendo.
 *
 * Hindi na kailangan ng machineId.
 */
export async function configureDevice(
    id: string,
    data: {
        machineName?: string;
        parentInterface?: string;
        vlanId?: number;
        ipMode?: string;
        ipAddressStatic?: string;
        subnetMask?: string;
        gateway?: string;
        dns1?: string;
        dns2?: string;
        clientStartIp?: number;
        clientEndIp?: number;
        bandwidthProfile?: string;
        portal?: string;
        enabled?: boolean;
    }
) {

    console.log(
        "========== CONFIGURE SUBVENDO =========="
    );

    console.log(
        "SubVendo ID:",
        id
    );

    console.log(
        "Configuration:",
        data
    );

    console.log(
        "========================================="
    );

    return prisma.subVendo.update({

        where: {
            id,
        },

        data: {

            ...data,

            status:
                "CONFIGURED",

            enabled:
                data.enabled ?? true,

        },

    });
}


/**
 * Get configured SubVendo devices.
 */
export async function getRegisteredDevices() {

    return prisma.subVendo.findMany({

        where: {
            status: "CONFIGURED",
        },

        orderBy: [
            {
                online: "desc",
            },
            {
                createdAt: "desc",
            },
        ],

    });
}


/**
 * Heartbeat from ESP8266.
 */
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

            online:
                true,

            uptime:
                data.uptime,

            connectedClients:
                data.connectedClients,

            freeMemory:
                data.freeMemory,

            wifiSignal:
                data.wifiSignal,

            temperature:
                data.temperature,

            lastSeen:
                new Date(),

        },

    });
}


/**
 * Get configuration for ESP8266.
 *
 * ESP8266 uses chipId as identity.
 */
export async function getConfiguration(
    chipId: string
) {

    return prisma.subVendo.findUnique({

        where: {
            chipId,
        },

        select: {

            chipId:
                true,

            machineName:
                true,

            parentInterface:
                true,

            vlanId:
                true,

            ipMode:
                true,

            ipAddressStatic:
                true,

            subnetMask:
                true,

            gateway:
                true,

            dns1:
                true,

            dns2:
                true,

            clientStartIp:
                true,

            clientEndIp:
                true,

            bandwidthProfile:
                true,

            portal:
                true,

            enabled:
                true,

            status:
                true,

        },

    });
}