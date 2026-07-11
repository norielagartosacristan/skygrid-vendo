import prisma from "../../config/prisma";
import { ipsetService } from "../captive/firewall/ipset.service";
import { sessionService } from "../captive/session/session.service";

class PaymentService {

    async processPayment(
        machineId: string,
        packageId: string,
        clientMac: string,
        clientIP: string,
        durationMinutes: number
    ) {

        const existingSession =
            await prisma.session.findFirst({

                where: {
                    clientMac,
                    ipAddress: clientIP,
                    isActive: true
                }

            });

        /**
         * First login only.
         * Do not call this again when extending.
         */
        if (!existingSession) {
            await ipsetService.allow(clientIP);
        }

        /**
         * SessionService will automatically:
         * - create new session
         * - extend existing session
         * - broadcast websocket update
         */
        const session =
            await sessionService.createSession(

                machineId,
                packageId,
                clientMac,
                clientIP,
                durationMinutes

            );

        return {

            success: true,

            action: existingSession
                ? "extended"
                : "created",

            session

        };

    }

}

export const paymentService =
    new PaymentService();