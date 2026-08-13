import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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

    console.log("Machine ID:", machineId);
    console.log("Client MAC:", clientMac);
    console.log("Client IP:", clientIP);
    console.log("Duration:", durationMinutes);


    /**
     * ========================================
     * FIND EXISTING SESSION
     * ========================================
     */

    const existing =
        await prisma.session.findFirst({

            where: {

                machineId,

                clientMac,

                isActive: true,

                isPaused: false,

                expiresAt: {
                    not: null
                }

            },

            orderBy: {

                createdAt: "desc"

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
            existing.expiresAt &&
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


        const updatedSession =
            await prisma.session.update({

                where: {

                    id:
                        existing.id

                },

                data: {

                    expiresAt:
                        newExpiresAt,

                    isActive:
                        true,

                    isPaused:
                        false,

                    packageId

                },

                include: {

                    package:
                        true

                }

            });


        /**
         * Allow internet
         */

        await ipsetService.allow(
            updatedSession.ipAddress
        );


        console.log(
            "✅ EXISTING SESSION EXTENDED"
        );

        console.log(
            "Session ID:",
            updatedSession.id
        );

        console.log(
            "Expires:",
            updatedSession.expiresAt
        );


        /**
         * Notify captive portal
         */

        captiveSocket.send(

            updatedSession.ipAddress,

            {

                type:
                    "session.updated",

                payload:
                    updatedSession

            }

        );


        return updatedSession;

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


    const newSession =
        await prisma.session.create({

            data: {

                machineId,

                packageId,

                clientMac,

                ipAddress:
                    clientIP,

                expiresAt,

                isActive:
                    true,

                isPaused:
                    false

            },

            include: {

                package:
                    true

            }

        });


    /**
     * Allow IP immediately
     */

    await ipsetService.allow(
        newSession.ipAddress
    );


    console.log(
        "✅ NEW SESSION CREATED"
    );

    console.log(
        "Session ID:",
        newSession.id
    );

    console.log(
        "Client IP:",
        newSession.ipAddress
    );

    console.log(
        "Expires:",
        newSession.expiresAt
    );


    /**
     * Notify portal
     */

    captiveSocket.send(

        newSession.ipAddress,

        {

            type:
                "session.created",

            payload:
                newSession

        }

    );


    return newSession;

}

    async getExistingSession(
    machineId: string,
    clientMac: string,
    clientIP: string
) {

    console.log(
        "========== CHECK EXISTING SESSION =========="
    );

    console.log("Machine ID:", machineId);
    console.log("Client MAC:", clientMac);
    console.log("Client IP:", clientIP);

    const session =
        await prisma.session.findFirst({

            where: {

                machineId,

                clientMac,

                isActive: true,

                expiresAt: {
                    not: null
                }

            },

            include: {
                package: true
            }

        });

    if (!session) {

        console.log(
            "❌ No existing session"
        );

        return null;

    }

    /**
     * PAUSED SESSION
     *
     * Do not calculate from expiresAt because
     * expiresAt is null while paused.
     */
    if (session.isPaused) {

        console.log(
            "⏸️ Existing session is paused"
        );

        return session;

    }

    /**
     * Check expiration
     */
    if (!session.expiresAt) {

        return null;

    }

    const remainingSeconds =
        Math.max(

            0,

            Math.floor(

                (
                    session.expiresAt.getTime() -
                    Date.now()

                ) / 1000

            )

        );

    /**
     * Session already expired
     */
    if (remainingSeconds <= 0) {

        console.log(
            "❌ Existing session expired"
        );

        await prisma.session.update({

            where: {
                id: session.id
            },

            data: {
                isActive: false
            }

        });

        await ipsetService.block(
            session.ipAddress
        );

        return null;

    }

    /**
     * Update current IP.
     *
     * IP may change when the client
     * reconnects to another Subvendo.
     */
    const updatedSession =
        await prisma.session.update({

            where: {
                id: session.id
            },

            data: {

                ipAddress:
                    clientIP

            },

            include: {
                package: true
            }

        });

    /**
     * Allow current client IP
     */
    await ipsetService.allow(
        clientIP
    );

    console.log(
        "✅ Existing session restored"
    );

    console.log(
        "Session ID:",
        updatedSession.id
    );

    console.log(
        "Remaining:",
        remainingSeconds,
        "seconds"
    );

    console.log(
        "New Client IP:",
        clientIP
    );

    /**
     * Notify portal
     */
    captiveSocket.send(

        clientIP,

        {

            type:
                "session.restored",

            payload:
                updatedSession

        }

    );

    return updatedSession;

}

async expireSession(
    sessionId: string
) {

    const session =
        await prisma.session.update({

            where: {

                id:
                    sessionId

            },

            data: {

                isActive:
                    false

            }

        });


    // Remove IP from allowed clients
    await ipsetService.block(
        session.ipAddress
    );


    // Tell the client that the session expired
    captiveSocket.send(

        session.ipAddress,

        {

            type:
                "session.expired"

        }

    );


    // Clear existing connections
    try {

        await execAsync(
            `sudo conntrack -D -s ${session.ipAddress} || true`
        );

        console.log(
            `🧹 Conntrack cleared: ${session.ipAddress}`
        );

    } catch (error) {

        console.error(
            `⚠️ Failed to clear conntrack: ${session.ipAddress}`,
            error
        );

    }


    console.log(
        `❌ Session expired: ${session.ipAddress}`
    );


    return session;

}
    
    async restoreActiveSessions(): Promise<void> {

    console.log("🔄 Restoring active client sessions...");

    const sessions = await prisma.session.findMany({
        where: {
            isActive: true,
            expiresAt: {
                gt: new Date()
            }
        }
    });

    console.log(
        `Found ${sessions.length} active sessions`
    );

    for (const session of sessions) {

        try {

            await ipsetService.allow(
                session.ipAddress
            );

            console.log(
                `✅ Restored Internet: ${session.ipAddress}`
            );

        } catch (err) {

            console.error(
                `❌ Failed to restore ${session.ipAddress}`,
                err
            );

        }

    }

}

async pauseSession(clientIP: string) {

    console.log(
        "[PAUSE] Searching active session for IP:",
        clientIP
    );

    const session =
        await prisma.session.findFirst({
            where: {
                ipAddress: clientIP,
                isActive: true,
                isPaused: false
            }
        });

if (!session) {
    throw new Error(
        "No active session found."
    );
}

if (!session.expiresAt) {
    throw new Error(
        "Session has no expiration time."
    );
}

const remainingSeconds =
    Math.max(
        0,
        Math.floor(
            (
                session.expiresAt.getTime() -
                Date.now()
            ) / 1000
        )
    );

    if (remainingSeconds <= 0) {

        await prisma.session.update({
            where: {
                id: session.id
            },
            data: {
                isActive: false
            }
        });

        throw new Error(
            "Session has already expired."
        );
    }

   /**
 * ========================================
 * BLOCK INTERNET WHILE PAUSED
 * ========================================
 *
 * Remove client IP from ipset so the
 * client immediately loses Internet access.
 */
await ipsetService.block(
    session.ipAddress
);

console.log(
    `⏸️ Internet blocked for paused client: ${session.ipAddress}`
);


/**
 * ========================================
 * MARK SESSION AS PAUSED
 * ========================================
 */

const pausedSession =
    await prisma.session.update({

        where: {
            id: session.id
        },

        data: {

            isPaused: true,

            remainingSeconds,

            pausedAt:
                new Date(),

            // Stop expiration while paused
            expiresAt:
                null

        }

    });

    await ipsetService.block(
    pausedSession.ipAddress
);

console.log(
    `⏸️ Internet blocked while paused: ${pausedSession.ipAddress}`
);

    // Block internet while paused
    await ipsetService.block(
        session.ipAddress
    );

    // Notify frontend
    captiveSocket.send(

        session.ipAddress,

        {

            type:
                "session.paused",

            payload:
                pausedSession

        }

    );

    console.log(
        "[PAUSE] Session paused."
    );

    console.log(
        "[PAUSE] Remaining:",
        remainingSeconds,
        "seconds"
    );

    return pausedSession;
}

async resumeSession(clientIP: string) {

    console.log(
        "[RESUME] Searching paused session for IP:",
        clientIP
    );

    const session =
        await prisma.session.findFirst({
            where: {
                ipAddress: clientIP,
                isActive: true,
                isPaused: true
            }
        });

    if (!session) {

        throw new Error(
            "No paused session found."
        );

    }

    const remainingSeconds =
        session.remainingSeconds || 0;

    if (remainingSeconds <= 0) {

        await prisma.session.update({

            where: {
                id: session.id
            },

            data: {

                isActive:
                    false,

                isPaused:
                    false,

                remainingSeconds:
                    0

            }

        });

        await ipsetService.block(
            session.ipAddress
        );

        throw new Error(
            "Session has expired."
        );

    }

    const expiresAt =
        new Date(
            Date.now() +
            remainingSeconds *
            1000
        );

    const resumedSession =
        await prisma.session.update({

            where: {
                id: session.id
            },

            data: {

                isPaused:
                    false,

                pausedAt:
                    null,

                remainingSeconds:
                    null,

                expiresAt

            },

            include: {

                package:
                    true

            }

        });

    // Restore internet
    await ipsetService.allow(
        session.ipAddress
    );

    // Notify frontend
    captiveSocket.send(

        session.ipAddress,

        {

            type:
                "session.resumed",

            payload:
                resumedSession

        }

    );

    console.log(
        "[RESUME] Session resumed."
    );

    console.log(
        "[RESUME] New expiresAt:",
        expiresAt
    );

    return resumedSession;
}
}


export const sessionService =
    new SessionService();