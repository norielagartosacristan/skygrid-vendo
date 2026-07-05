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
const machineStorage_service_1 = require("./machineStorage.service");
class MachineService {
    async register() {
        const fingerprint = fingerprint_service_1.fingerprintService.generate();
        let machine = await prisma_1.default.machine.findFirst({
            where: {
                fingerprint
            }
        });
        if (!machine) {
            const mac = Object.values(os_1.default.networkInterfaces())
                .flat()
                .find(i => i?.mac && i.mac !== "00:00:00:00:00:00")
                ?.mac ?? "";
            const ip = Object.values(os_1.default.networkInterfaces())
                .flat()
                .find(i => i?.family === "IPv4" && !i.internal)
                ?.address ?? "";
            const vendor = await vendor_service_1.vendorService.getOrCreateDefaultVendor();
            machine =
                await prisma_1.default.machine.create({
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
        machineStorage_service_1.machineStorageService.save({
            machineId: machine.id,
            fingerprint
        });
        return machine;
    }
    getMachineId() {
        const data = machineStorage_service_1.machineStorageService.load();
        return data.machineId;
    }
    async getCurrentMachine() {
        return prisma_1.default.machine.findUnique({
            where: {
                id: this.getMachineId()
            }
        });
    }
}
exports.machineService = new MachineService();
