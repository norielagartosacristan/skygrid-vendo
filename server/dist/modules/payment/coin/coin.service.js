"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const session_service_1 = require("../../captive/session/session.service");
class CoinService {
    async insertCoin(machineId, clientMac, clientIP, amount) {
        console.log("========== COIN INSERTED ==========");
        console.log("Amount:", amount);
        const pkg = await prisma_1.default.package.findFirst({
            where: {
                price: amount,
                isActive: true
            }
        });
        if (!pkg) {
            throw new Error(`No package configured for ₱${amount}`);
        }
        const session = await session_service_1.sessionService.createSession(machineId, pkg.id, clientMac, clientIP, pkg.duration);
        await prisma_1.default.coinTransaction.create({
            data: {
                machineId,
                sessionId: session.id,
                amount: pkg.price
            }
        });
        console.log(`💰 Coin transaction saved: ₱${pkg.price}`);
        return {
            success: true,
            session
        };
    }
}
exports.coinService = new CoinService();
