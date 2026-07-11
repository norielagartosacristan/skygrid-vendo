import { exec } from "child_process";
import prisma from "../../../config/prisma";
import { ipsetService } from "../firewall/ipset.service";
import { captiveSocket } from "../websocket/captive.socket";
class SessionService {

    async createSession(
        machineId: string,
        packageId: string,
        clientMac: string,
        clientIP: string,
        durationMinutes: number
    ) {

        console.log("========== CREATE SESSION ==========");
        console.log("Machine:", machineId);
        console.log("Package:", packageId);
        console.log("Client MAC:", clientMac);
        console.log("Client IP:", clientIP);

        const existing =
            await prisma.session.findFirst({

                where: {
                    ipAddress: clientIP,
                    isActive: true
                },

                include: {
                    package: true
                }

            });

        /**
         * EXTEND SESSION
         */
        if (existing) {

            const now = Date.now();

            const baseTime =
                existing.expiresAt.getTime() > now
                    ? existing.expiresAt.getTime()
                    : now;

            const newExpiresAt =
                new Date(
                    baseTime +
                    durationMinutes * 60 * 1000
                );

            const session =
                await prisma.session.update({
                    where: {
                        id: existing.id
                    },

                    data: {
                        packageId,
                        expiresAt: newExpiresAt
                    },

                    include: {
                        package: true
                    }

                });
                await ipsetService.allow(session.ipAddress);

            console.log(
                `➕ Session extended until ${newExpiresAt}`
            );

            captiveSocket.send(
                session.ipAddress,
                {
                    type: "session.updated",
                    payload: session
                }
            );

            return session;

        }

        /**
         * CREATE NEW SESSION
         */

        const expiresAt =
            new Date(
                Date.now() +
                durationMinutes * 60 * 1000
            );

        const session =
            await prisma.session.create({

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

        console.log(
            `✅ New session created until ${expiresAt}`
        );

        captiveSocket.send(
            session.ipAddress,
            {
                type: "session.created",
                payload: session
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