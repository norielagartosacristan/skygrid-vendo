"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const session_service_1 = require("../captive/session/session.service");
class PaymentService {
    async processPayment(machineId, packageId, clientMac, clientIP, durationMinutes) {
        const existingSession = await prisma_1.default.session.findFirst({
            where: {
                clientMac,
                ipAddress: clientIP,
                isActive: true
            }
        });
        /**
         * SessionService will automatically:
         * - create new session
         * - extend existing session
         * - broadcast websocket update
         */
        const session = await session_service_1.sessionService.createSession(machineId, packageId, clientMac, clientIP, durationMinutes);
        return {
            success: true,
            action: existingSession
                ? "extended"
                : "created",
            session
        };
    }
}
exports.paymentService = new PaymentService();
