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
        try {
            const { clientMac, clientIP, amount } = data;
            console.log("========== COIN INSERTED ==========");
            console.log("Client:", clientIP);
            console.log("Amount:", amount);
            console.log("Looking for package...");
            const pkg = await prisma_1.default.package.findFirst({
                where: {
                    price: Number(amount),
                    isActive: true
                }
            });
            console.log("Package:", pkg);
            if (!pkg) {
                throw new Error(`No package configured for ₱${amount}`);
            }
            console.log("Loading current machine...");
            const machine = await machine_service_1.machineService.getCurrentMachine();
            console.log("Machine:", machine);
            if (!machine) {
                throw new Error("Machine not registered.");
            }
            console.log("Creating session...");
            const session = await session_service_1.sessionService.createSession(machine.id, pkg.id, clientMac, clientIP, (0, time_1.convertToMinutes)(pkg.duration, pkg.durationUnit));
            console.log("Session:", session);
            // await ipsetService.allow(clientIP);
            await prisma_1.default.coinTransaction.create({
                data: {
                    machineId: machine.id,
                    sessionId: session.id,
                    amount: pkg.price
                }
            });
            console.log("Coin transaction saved.");
            return {
                success: true,
                session
            };
        }
        catch (err) {
            console.error("COIN ERROR:", err);
            throw err;
        }
    }
}
exports.coinService = new CoinService();
