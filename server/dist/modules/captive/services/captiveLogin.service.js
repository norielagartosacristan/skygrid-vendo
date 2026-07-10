"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.captiveLoginService = void 0;
const voucher_service_1 = require("../../voucher/services/voucher.service");
const ipset_service_1 = require("../firewall/ipset.service");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const session_service_1 = require("../session/session.service");
const time_1 = require("../../../utils/time");
const machine_service_1 = require("../../machine/services/machine.service");
class CaptiveLoginService {
    async login(data) {
        const { voucher, clientIP } = data;
        console.log("========== LOGIN START ==========");
        console.log("Voucher:", voucher);
        console.log("Client:", clientIP);
        // 1
        const voucherData = await voucher_service_1.voucherService.redeem(voucher);
        console.log("Voucher OK");
        console.log(voucherData);
        // 2
        console.log("Adding IP to ipset...");
        await ipset_service_1.ipsetService.allow(clientIP);
        console.log("IPSET DONE");
        // 3
        const machine = await machine_service_1.machineService.getCurrentMachine();
        if (!machine) {
            throw new Error("Machine not registered.");
        }
        const machineId = machine.id;
        console.log("Machine:", machine);
        console.log("Machine ID:", machineId);
        console.log("Creating session...");
        const session = await session_service_1.sessionService.createSession(machineId, voucherData.package.id, clientIP, clientIP, (0, time_1.convertToMinutes)(voucherData.package.duration, voucherData.package.durationUnit));
        console.log("Session Created");
        console.log(session);
        // 4
        console.log("Updating voucher...");
        await prisma_1.default.voucher.update({
            where: {
                id: voucherData.id
            },
            data: {
                status: "USED",
                usedByIP: clientIP,
                usedAt: new Date()
            }
        });
        console.log("Voucher Updated");
        console.log("========== LOGIN SUCCESS ==========");
        return {
            success: true,
            message: "Login Successful",
            session
        };
    }
    async logout(clientIP) {
        await ipset_service_1.ipsetService.block(clientIP);
        return {
            success: true,
            message: "Logged Out"
        };
    }
}
exports.captiveLoginService = new CaptiveLoginService();
