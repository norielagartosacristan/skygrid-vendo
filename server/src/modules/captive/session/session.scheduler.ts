import prisma from "../../../config/prisma";
import { sessionService } from "./session.service";
import { ipsetService } from "../firewall/ipset.service";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

class SessionScheduler {

    start() {

        console.log("🕒 Session Scheduler Started");

        setInterval(async () => {

            try {

                const expiredSessions =
                    await prisma.session.findMany({

                        where: {

                            isActive: true,

                            expiresAt: {

                                lte: new Date()

                            }

                        }

                    });

                for (const session of expiredSessions) {

                    console.log(
                        `⏰ Expiring ${session.ipAddress}`
                    );

                    await sessionService.expireSession(
                        session.id
                    );

                }

            } catch (err) {

                console.error(
                    "Session Scheduler:",
                    err
                );

            }

        }, 5000);

    }

}

export const sessionScheduler =
    new SessionScheduler();