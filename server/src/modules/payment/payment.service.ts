import prisma from "../../config/prisma";
import { sessionService } from "../captive/session/session.service";

class PaymentService {

    async processPayment(
        machineId: string,
        packageId: string,
        clientMac: string,
        clientIP: string,
        durationMinutes: number
    ) {

        const activeSession =
            await prisma.session.findFirst({

                where: {

                    clientMac,
                    isActive: true

                }

            });

        // Existing session
        if (activeSession) {

            const expiresAt =
                activeSession.expiresAt.getTime();

            const now = Date.now();

            const base =
                expiresAt > now ? expiresAt : now;

            const newExpiresAt =
                new Date(
                    base +
                    durationMinutes * 60 * 1000
                );

            const updated =
                await prisma.session.update({

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
        const session =
            await sessionService.createSession(

                machineId,
                packageId,
                clientMac,
                clientIP,
                durationMinutes

            );

        return {

            action: "created",
            session

        };

    }

}

export const paymentService =
    new PaymentService();