import { exec } from "child_process";
import prisma from "../../../config/prisma";
import { ipsetService } from "../firewall/ipset.service";
import { captiveSocket } from "../websocket/captive.socket";
class SessionService {

   async createSession(
    machineId: string,
    packageId: string | null,
    clientMac: string,
    clientIP: string,
    durationMinutes: number
) {

    console.log("========== CREATE SESSION ==========");
    console.log("Machine:", machineId);
    console.log("Package:", packageId);
    console.log("Client MAC:", clientMac);
    console.log("Client IP:", clientIP);
    console.log("Duration:", durationMinutes, "minutes");


    /**
     * Find existing active session
     * using client IP.
     */
    const existing =
        await prisma.session.findFirst({

            where: {

                ipAddress:
                    clientIP,

                isActive:
                    true

            },

            include: {

                package:
                    true

            }

        });


    /**
     * ========================================
     * EXTEND EXISTING SESSION
     * ========================================
     */
    if (existing) {

        const now =
            Date.now();


        const baseTime =
            existing.expiresAt.getTime() > now

                ? existing.expiresAt.getTime()

                : now;


        const newExpiresAt =
            new Date(

                baseTime +

                durationMinutes *
                60 *
                1000

            );


        const session =
            await prisma.session.update({

                where: {

                    id:
                        existing.id

                },

                data: {

                    expiresAt:
                        newExpiresAt,

                    isActive:
                        true

                },

                include: {

                    package:
                        true

                }

            });


        /**
         * IMPORTANT
         *
         * Re-allow client IP.
         */
        await ipsetService.allow(
            session.ipAddress
        );


        console.log(
            "✅ IP allowed:",
            session.ipAddress
        );


        console.log(
            "➕ Session extended until:",
            newExpiresAt
        );


        /**
         * Immediately notify portal.
         */
        captiveSocket.send(

            session.ipAddress,

            {

                type:
                    "session.updated",

                payload:
                    session

            }

        );


        return session;

    }


    /**
     * ========================================
     * CREATE NEW SESSION
     * ========================================
     */
    const expiresAt =
        new Date(

            Date.now() +

            durationMinutes *
            60 *
            1000

        );


    const session =
        await prisma.session.create({

            data: {

                machineId,

                packageId,

                clientMac,

                ipAddress:
                    clientIP,

                expiresAt,

                isActive:
                    true

            },

            include: {

                package:
                    true

            }

        });


    /**
     * IMPORTANT
     *
     * Allow IP immediately.
     */
    await ipsetService.allow(
        session.ipAddress
    );


    console.log(
        "✅ NEW SESSION CREATED"
    );


    console.log(
        "Session ID:",
        session.id
    );


    console.log(
        "Client IP:",
        session.ipAddress
    );


    console.log(
        "Expires:",
        session.expiresAt
    );


    console.log(
        "🔥 IPSET ALLOWED:",
        session.ipAddress
    );


    /**
     * Notify portal immediately.
     */
    captiveSocket.send(

        session.ipAddress,

        {

            type:
                "session.created",

            payload:
                session

        }

    );


    return session;

}

    async expireSession(sessionId: string) {

        const session =
            await prisma.session.update({
                where: {
                    id: sessionId
                },

                data: {
                    isActive: false
                }

            });
             await ipsetService.allow(session.ipAddress);

        await ipsetService.block(
            session.ipAddress
        );

        captiveSocket.send(
            session.ipAddress,
            {
                type: "session.expired"
            }
        );

        exec(
            `sudo conntrack -D -s ${session.ipAddress} || true`,
            () => {}
        );

        console.log(
            `❌ Session expired: ${session.ipAddress}`
        );

        return session;

    }

}

export const sessionService =
    new SessionService();