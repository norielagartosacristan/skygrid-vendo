import prisma from "../../../config/prisma";

class SessionService {

    async createSession(
        voucherId: string,
        clientIP: string,
        durationMinutes: number
    ) {

        const expiresAt = new Date(
            Date.now() + durationMinutes * 60 * 1000
        );

        return await prisma.session.create({

            data: {

                voucherId,
                clientIP,
                expiresAt,
                active: true

            }

        });

    }

    async expireSession(sessionId: string) {

        return await prisma.session.update({

            where: { id: sessionId },

            data: { active: false }

        });

    }

}

export const sessionService = new SessionService();