"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDevice = registerDevice;
exports.getPendingDevices = getPendingDevices;
exports.configureDevice = configureDevice;
exports.getRegisteredDevices = getRegisteredDevices;
const prisma_1 = __importDefault(require("../config/prisma"));
async function registerDevice(data) {
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
