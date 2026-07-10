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
        const activeSession = await prisma_1.default.session.findFirst({
            where: {
                clientMac,
                isActive: true
            }
        });
        // Existing session
        if (activeSession) {
            const expiresAt = activeSession.expiresAt.getTime();
            const now = Date.now();
            const base = expiresAt > now ? expiresAt : now;
            const newExpiresAt = new Date(base +
                durationMinutes * 60 * 1000);
            const updated = await prisma_1.default.session.update({
                where: {
                    id: activeSession.id
                },
                data: {
                    expiresAt: newExpiresAt
                },
                include: {
                    package: true
                }
            });
            return {
                action: "extended",
                session: updated
            };
        }
        // No session
        const session = await session_service_1.sessionService.createSession(machineId, packageId, clientMac, clientIP, durationMinutes);
        return {
            action: "created",
            session
        };
    }
}
exports.paymentService = new PaymentService();
