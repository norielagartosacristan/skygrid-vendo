"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoProvision = autoProvision;
const prisma_1 = __importDefault(require("../config/prisma"));
const networkEngine_service_1 = require("./networkEngine.service");
async function autoProvision() {
    const interfaces = (0, networkEngine_service_1.detectInterfaces)();
    for (const item of interfaces) {
        const existing = await prisma_1.default.networkInterface.findFirst({
            where: {
                name: item.name,
            },
        });
        if (existing)
            continue;
        await prisma_1.default.networkInterface.create({
            data: {
                name: item.name,
                displayName: "Internet",
                role: "WAN",
                type: "ETHERNET",
                enabled: true,
                ipMode: "DHCP",
                ipAddress: item.ipAddress,
                subnetMask: item.subnetMask,
            },
        });
        console.log("Imported:", item.name);
    }
}
