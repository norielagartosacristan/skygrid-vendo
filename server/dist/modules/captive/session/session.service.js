"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionService = void 0;
const child_process_1 = require("child_process");
const prisma_1 = __importDefault(require("../../../config/prisma"));
//import { networkSocket } from "../../network/websocket/network.socket";
const ipset_service_1 = require("../firewall/ipset.service");
//import { machineService } from "../../machine/services/machine.service";
const captive_socket_1 = require("../websocket/captive.socket");
class SessionService {
    async createSession(machineId, packageId, clientMac, clientIP, durationMinutes) {
        console.log("========== CREATE SESSION ==========");
        console.log("machineId:", machineId);
        console.log("packageId:", packageId);
        console.log("clientIP:", clientIP);
        console.log("clientMac:", clientMac);
        const existing = await prisma_1.default.session.findFirst({
            where: {
                clientMac,
                isActive: true
            },
            include: {
                package: true
            }
        });
        console.log("Existing session:", existing);
        if (existing) {
            const baseTime = existing.expiresAt > new Date()
                ? existing.expiresAt
                : new Date();
            const newExpiresAt = new Date(baseTime.getTime() +
                durationMinutes * 60 * 1000);
            const session = await prisma_1.default.session.update({
                where: {
                    id: existing.id
                },
                data: {
                    ipAddress: clientIP,
                    packageId,
                    expiresAt: newExpiresAt
                },
                include: {
                    package: true
                }
            });
            console.log(`➕ Session extended until ${newExpiresAt}`);
            captive_socket_1.captiveSocket.send(session.ipAddress, {
                type: "session.updated",
                payload: session
            });
            return session;
        }
        const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);
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
        captive_socket_1.captiveSocket.send(session.ipAddress, {
            type: "session.created",
            payload: session
        });
        return session;
    }
    async expireSession(sessionId) {
        const session = await prisma_1.default.session.update({
            where: {
                id: sessionId
            },
            data: {
                isActive: false
            }
        });
        await ipset_service_1.ipsetService.block(session.ipAddress);
        captive_socket_1.captiveSocket.send(session.ipAddress, {
            type: "session.expired"
        });
        (0, child_process_1.exec)(`sudo conntrack -D -s ${session.ipAddress} || true`, () => { });
        console.log(`❌ Session expired: ${session.ipAddress}`);
        return session;
    }
}
exports.sessionService = new SessionService();
