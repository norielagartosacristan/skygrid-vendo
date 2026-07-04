"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterfaces = getInterfaces;
exports.getInterface = getInterface;
exports.createInterface = createInterface;
exports.updateInterface = updateInterface;
exports.deleteInterface = deleteInterface;
const prisma_1 = __importDefault(require("../config/prisma"));
const child_process_1 = require("child_process");
async function getInterfaces() {
    return prisma_1.default.networkInterface.findMany({
        orderBy: {
            createdAt: "asc",
        },
    });
}
async function getInterface(id) {
    return prisma_1.default.networkInterface.findUnique({
        where: { id },
    });
}
async function createInterface(data) {
    // 1. SAVE SA DATABASE MUNA
    const networkInterface = await prisma_1.default.networkInterface.create({
        data,
    });
    // 2. VLAN LOGIC (LINUX LEVEL)
    if (data.type === "VLAN") {
        const interfaceName = `${data.parentInterface}.${data.vlanId}`;
        try {
            (0, child_process_1.execSync)(`ip link add link ${data.parentInterface} name ${interfaceName} type vlan id ${data.vlanId}`);
            (0, child_process_1.execSync)(`ip addr add ${data.ipAddress}/${data.subnetMask === "255.255.255.0" ? 24 : 24} dev ${interfaceName}`);
            (0, child_process_1.execSync)(`ip link set ${interfaceName} up`);
        }
        catch (err) {
            console.log("VLAN creation failed:", err);
        }
    }
    return networkInterface;
}
async function updateInterface(id, data) {
    return prisma_1.default.networkInterface.update({
        where: {
            id,
        },
        data,
    });
}
async function deleteInterface(id) {
    return prisma_1.default.networkInterface.delete({
        where: {
            id,
        },
    });
}
