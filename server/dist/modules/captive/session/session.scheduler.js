"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionScheduler = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const session_service_1 = require("./session.service");
class SessionScheduler {
    start() {
        console.log("🕒 Session Scheduler Started");
        setInterval(async () => {
            try {
                const expiredSessions = await prisma_1.default.session.findMany({
                    where: {
                        isActive: true,
                        expiresAt: {
                            lte: new Date()
                        }
                    }
                });
                for (const session of expiredSessions) {
                    console.log(`⏰ Expiring ${session.ipAddress}`);
                    await session_service_1.sessionService.expireSession(session.id);
                }
            }
            catch (err) {
                console.error("Session Scheduler:", err);
            }
        }, 5000);
    }
}
exports.sessionScheduler = new SessionScheduler();
