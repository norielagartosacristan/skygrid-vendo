"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.machineService = void 0;
const os_1 = __importDefault(require("os"));
const prisma_1 = __importDefault(require("../../../config/prisma"));
const vendor_service_1 = require("../../vendor/services/vendor.service");
const fingerprint_service_1 = require("./fingerprint.service");
//import { machineStorageService } from "./machineStorage.service";
class MachineService {
    async register() {
        const fingerprint = fingerprint_service_1.fingerprintService.generate();
        console.log("Generated fingerprint:", fingerprint);
        const mac = Object.values(os_1.default.networkInterfaces())
            .flat()
            .find(i => i?.mac && i.mac !== "00:00:00:00:00:00")
            ?.mac ?? "";
        const ip = Object.values(os_1.default.networkInterfaces())
            .flat()
            .find(i => i?.family === "IPv4" && !i.internal)
            ?.address ?? "";
        // Hanapin muna gamit ang fingerprint
        let machine = await prisma_1.default.machine.findFirst({
            where: {
                fingerprint
            }
        });
        // Kung wala, hanapin gamit ang MAC address
        if (!machine) {
            machine = await prisma_1.default.machine.findFirst({
                where: {
                    macAddress: mac
                }
            });
        }
        // Kung wala pa rin, saka lang gumawa ng bagong machine
        if (!machine) {
            const vendor = await vendor_service_1.vendorService.getOrCreateDefaultVendor();
            machine = await prisma_1.default.machine.create({
                data: {
                    vendorId: vendor.id,
                    name: os_1.default.hostname(),
                    ipAddress: ip,
                    macAddress: mac,
                    fingerprint,
                    status: "ONLINE"
                }
            });
        }
        return machine;
    }
    async getCurrentMachine() {
        const fingerprint = fingerprint_service_1.fingerprintService.generate();
        return prisma_1.default.machine.findFirst({
            where: {
                fingerprint
            }
        });
    }
}
exports.machineService = new MachineService();
