"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDevice = registerDevice;
exports.getPendingDevices = getPendingDevices;
exports.configureDevice = configureDevice;
exports.getRegisteredDevices = getRegisteredDevices;
exports.heartbeat = heartbeat;
exports.getConfiguration = getConfiguration;
const prisma_1 = __importDefault(require("../config/prisma"));
async function registerDevice(data) {
    console.log("SERVICE DATA:", data);
    const existing = await prisma_1.default.subVendo.findUnique({
        where: {
            macAddress: data.macAddress,
        },
    });
    if (existing) {
        return prisma_1.default.subVendo.update({
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
    return prisma_1.default.subVendo.create({
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
async function getPendingDevices() {
    return prisma_1.default.subVendo.findMany({
        where: {
            status: "PENDING",
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function configureDevice(id, data) {
    return prisma_1.default.subVendo.update({
        where: {
            id,
        },
        data: {
            ...data,
            status: "REGISTERED",
        },
    });
}
async function getRegisteredDevices() {
    return prisma_1.default.subVendo.findMany({
        where: {
            status: "REGISTERED",
        },
        orderBy: {
            machineName: "asc",
        },
    });
}
async function heartbeat(chipId, data) {
    return prisma_1.default.subVendo.update({
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
async function getConfiguration(chipId) {
    return prisma_1.default.subVendo.findUnique({
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
