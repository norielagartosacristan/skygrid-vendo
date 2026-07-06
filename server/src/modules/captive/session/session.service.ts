import prisma from "../../../config/prisma";
import { networkSocket } from "../../network/websocket/network.socket";

class SessionService {

    async createSession(
    machineId: string,
    packageId: string,
    clientMac: string,
    clientIP: string,
    durationMinutes: number
) {

    const expiresAt = new Date(
        Date.now() + durationMinutes * 60 * 1000
    );

    console.log("========== CREATE SESSION ==========");
    console.log("machineId:", machineId);
    console.log("packageId:", packageId);
    console.log("clientIP:", clientIP);
    console.log("clientMac:", clientMac);

    const session = await prisma.session.create({

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

    networkSocket.broadcast({

        type: "session.created",

        payload: session

    });

    return session;

}

    async expireSession(sessionId: string) {

        return await prisma.session.update({

            where: {
                id: sessionId
            },

            data: {
                isActive: false
            }

        });

    }

}

export const sessionService = new SessionService();