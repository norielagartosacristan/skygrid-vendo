import { exec } from "child_process";
import prisma from "../../../config/prisma";
//import { networkSocket } from "../../network/websocket/network.socket";
import { ipsetService } from "../firewall/ipset.service";
//import { machineService } from "../../machine/services/machine.service";
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
    console.log("machineId:", machineId);
    console.log("packageId:", packageId);
    console.log("clientIP:", clientIP);
    console.log("clientMac:", clientMac);

    const existing = await prisma.session.findFirst({

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

        const baseTime =
            existing.expiresAt > new Date()
                ? existing.expiresAt
                : new Date();

        const newExpiresAt = new Date(
            baseTime.getTime() +
            durationMinutes * 60 * 1000
        );

        const session = await prisma.session.update({

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

    const expiresAt = new Date(
        Date.now() + durationMinutes * 60 * 1000
    );

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

export const sessionService = new SessionService();