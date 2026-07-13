import prisma from "../../../config/prisma";
import { subVendoSocket } from "../websocket/subvendo.socket";

class SubVendoService {

    async register(data: {

        chipId: string;

        macAddress: string;

        firmwareVersion: string;

        ipAddress: string;

    }) {

        const existing =
            await prisma.subVendo.findUnique({

                where: {
                    chipId: data.chipId
                }

            });

        if (existing) {

            return prisma.subVendo.update({

                where: {
                    chipId: data.chipId
                },

                data: {

                    macAddress: data.macAddress,

                    firmwareVersion: data.firmwareVersion,

                    ipAddress: data.ipAddress,

                    online: true,

                    lastSeen: new Date()

                }

            });

        }

        return prisma.subVendo.create({

            data: {

                chipId: data.chipId,

                macAddress: data.macAddress,

                firmwareVersion: data.firmwareVersion,

                ipAddress: data.ipAddress,

                lastSeen: new Date(),

                online: true

            }

        });

    }

    async heartbeat(data: {

        chipId: string;

        freeMemory: number;

        uptime: number;

        wifiSignal: number;

        temperature: number;

        connectedClients: number;

    }) {

        return prisma.subVendo.update({

            where: {

                chipId: data.chipId

            },

            data: {

                freeMemory: data.freeMemory,

                uptime: data.uptime,

                wifiSignal: data.wifiSignal,

                temperature: data.temperature,

                connectedClients: data.connectedClients,

                lastSeen: new Date(),

                online: true

            }

        });

    }

    async getConfig(chipId: string) {

    const device =
        await prisma.subVendo.findUnique({

            where: {
                chipId
            }

        });

    if (!device) {

        throw new Error("Device not found.");

    }

    if (
        device.status !== "APPROVED" ||
        !device.enabled
    ) {

        return {

            ready: false,

            message: "Waiting for approval."

        };

    }

    return {

        ready: true,

        machineName: device.machineName,

        parentInterface: device.parentInterface,

        vlanId: device.vlanId,

        ipMode: device.ipMode,

        ipAddress: device.ipAddressStatic,

        subnetMask: device.subnetMask,

        gateway: device.gateway,

        dns1: device.dns1,

        dns2: device.dns2,

        clientStartIp: device.clientStartIp,

        clientEndIp: device.clientEndIp,

        bandwidthProfile: device.bandwidthProfile,

        portal: device.portal

    };

}


async approve(id: string) {

    const device = await prisma.subVendo.update({

        where: {
            id
        },

        data: {
            status: "APPROVED",
            enabled: true
        }

    });

    subVendoSocket.send(device.chipId, {

        type: "DEVICE_APPROVED"

    });

    return device;

}

async pending() {

    return prisma.subVendo.findMany({

        where: {

            status: "PENDING"

        },

        orderBy: {

            createdAt: "desc"

        }

    });

}

}

export const subVendoService =
    new SubVendoService();