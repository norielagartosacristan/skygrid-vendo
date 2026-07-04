import prisma from "../../../config/prisma";

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

        return await prisma.session.create({

            data: {

                machineId,
                packageId,
                clientMac,

                ipAddress: clientIP,

                expiresAt,

                isActive: true

            }

        });

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