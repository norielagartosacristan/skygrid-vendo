"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subVendoService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const subvendo_socket_1 = require("../websocket/subvendo.socket");
class SubVendoService {
    async register(data) {
        const existing = await prisma_1.default.subVendo.findUnique({
            where: {
                chipId: data.chipId
            }
        });
        if (existing) {
            return prisma_1.default.subVendo.update({
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
        return prisma_1.default.subVendo.create({
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
    async heartbeat(data) {
        return prisma_1.default.subVendo.update({
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
    async getConfig(chipId) {
        const device = await prisma_1.default.subVendo.findUnique({
            where: {
                chipId
            }
        });
        if (!device) {
            throw new Error("Device not found.");
        }
        if (device.status !== "APPROVED" ||
            !device.enabled) {
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
    async approve(id) {
        const device = await prisma_1.default.subVendo.update({
            where: {
                id
            },
            data: {
                status: "APPROVED",
                enabled: true
            }
        });
        subvendo_socket_1.subVendoSocket.send(device.chipId, {
            type: "DEVICE_APPROVED"
        });
        return device;
    }
}
exports.subVendoService = new SubVendoService();
