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
class CaptiveLoginService {
    async login(data) {
        const { voucher, clientIP } = data;
        // 1. Validate voucher
        const voucherData = await voucher_service_1.voucherService.redeem(voucher);
        // 2. Allow internet
        await ipset_service_1.ipsetService.allow(clientIP);
        // 3. Create session
        await session_service_1.sessionService.createSession(Math.random().toString(36).substr(2, 9), voucherData.id, clientIP, clientIP, (0, time_1.convertToMinutes)(voucherData.package.duration, voucherData.package.durationUnit));
        // 4. Mark voucher as used
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
        return {
            success: true,
            message: "Login Successful",
            ip: clientIP,
            voucher
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
