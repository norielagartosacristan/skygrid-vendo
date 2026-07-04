"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class SessionService {
    async createSession(voucherId, clientIP, durationMinutes) {
        const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);
        return await prisma_1.default.session.create({
            data: {
                voucherId,
                clientIP,
                expiresAt,
                active: true
            }
        });
    }
    async expireSession(sessionId) {
        return await prisma_1.default.session.update({
            where: { id: sessionId },
            data: { active: false }
        });
    }
}
exports.sessionService = new SessionService();
