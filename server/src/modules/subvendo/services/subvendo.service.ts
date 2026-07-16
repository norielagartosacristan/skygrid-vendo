import prisma from "../../../config/prisma";
import { subVendoSocket } from "../websocket/subvendo.socket";

class SubVendoService {

    async register(data: {
        chipId: string;
        macAddress: string;
        firmwareVersion: string;
        ipAddress: string;
    }) {
        const existing = await prisma.subVendo.findUnique({
            where: {
                chipId: data.chipId
            }
        });

        if (existing) {
            // Kung may record na, i-update lamang natin ang status/activity fields
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

        // KUNG BAGO ANG DEVICE:
        // I-save sa database na may initial status na "PENDING"
        return prisma.subVendo.create({
            data: {
                chipId: data.chipId,
                macAddress: data.macAddress,
                firmwareVersion: data.firmwareVersion,
                ipAddress: data.ipAddress,
                lastSeen: new Date(),
                online: true,
                status: "PENDING" // <--- Dito natin sisiguraduhin na papasok ito sa Pending list!
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
        const device = await prisma.subVendo.findUnique({
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

async registered() {
    return prisma.subVendo.findMany({
        where: {
            status: {
                in: [
                    "APPROVED",
                    "CONFIGURED"
                ]
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}

    async update(id: string, data: any) {
        return prisma.subVendo.update({
            where: {
                id
            },
            data: {
                machineName: data.machineName,
                parentInterface: data.parentInterface,
                vlanId: data.vlanId,
                ipMode: data.ipMode,
                ipAddressStatic: data.ipAddressStatic,
                subnetMask: data.subnetMask,
                gateway: data.gateway,
                dns1: data.dns1,
                dns2: data.dns2,
                clientStartIp: data.clientStartIp,
                clientEndIp: data.clientEndIp,
                bandwidthProfile: data.bandwidthProfile,
                portal: data.portal,
                status: "CONFIGURED"
            }
        });
    }

    async coin(data: any)
{
    console.log("COIN RECEIVED");

    console.log(data);

    return {

        success: true,

        message: "Coin Received"

    };
}
}



export const subVendoService = new SubVendoService();