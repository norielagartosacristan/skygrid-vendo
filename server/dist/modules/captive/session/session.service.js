"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const network_socket_1 = require("../../network/websocket/network.socket");
class SessionService {
    async createSession(machineId, packageId, clientMac, clientIP, durationMinutes) {
        const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);
        console.log("========== CREATE SESSION ==========");
        console.log("machineId:", machineId);
        console.log("packageId:", packageId);
        console.log("clientIP:", clientIP);
        console.log("clientMac:", clientMac);
        const session = await prisma_1.default.session.create({
            data: {
                machineId,
                packageId,
                clientMac,
                ipAddress: clientIP,
                expiresAt,
                isActive: true
            },
            include: {
                package: true
            }
        });
        network_socket_1.networkSocket.broadcast({
            type: "session.created",
            payload: session
        });
        return session;
    }
    async expireSession(sessionId) {
        return await prisma_1.default.session.update({
            where: {
                id: sessionId
            },
            data: {
                isActive: false
            }
        });
    }
}
exports.sessionService = new SessionService();
