"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const session_service_1 = require("../../captive/session/session.service");
const time_1 = require("../../../utils/time");
const machine_service_1 = require("../../machine/services/machine.service");
class CoinService {
    async insertCoin(data) {
        const { clientMac, clientIP, amount } = data;
        console.log("========== COIN INSERTED ==========");
        //console.log("Machine:", machineId);
        console.log("Client:", clientIP);
        console.log("Amount:", amount);
        const pkg = await prisma_1.default.package.findFirst({
            where: {
                price: Number(amount),
                isActive: true
            }
        });
        if (!pkg) {
            throw new Error(`No package configured for ₱${amount}`);
        }
        const machine = await machine_service_1.machineService.getCurrentMachine();
        if (!machine) {
            throw new Error("Machine not registered.");
        }
        const machineId = machine.id;
        const session = await session_service_1.sessionService.createSession(machineId, pkg.id, clientMac, clientIP, (0, time_1.convertToMinutes)(pkg.duration, pkg.durationUnit));
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
