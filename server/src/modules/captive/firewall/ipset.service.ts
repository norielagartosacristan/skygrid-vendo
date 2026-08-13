import { exec } from "child_process";
import { promisify } from "util";

import prisma from "../../../config/prisma";

const execAsync = promisify(exec);

/**
 * Full path to ipset using sudo (NOPASSWD configured)
 */
const IPSET = "/usr/sbin/ipset";

class IPSetService {

    /**
     * Execute shell command
     */
    private async run(command: string): Promise<string> {

        try {

            const { stdout } = await execAsync(command);

            return stdout;

        } catch (err: any) {

            throw new Error(
                err.stderr || err.message
            );

        }

    }

    async ensureSet(): Promise<void> {

    await this.run(
        `${IPSET} create skygrid_clients hash:ip -exist`
    );

    console.log(
        "✅ ipset skygrid_clients ready"
    );
}

    /**
     * Allow client Internet access
     */
    async allow(ip: string): Promise<void> {

        await this.run(
            `${IPSET} add skygrid_clients ${ip} -exist`
        );

        console.log(`✅ Allowed Client: ${ip}`);

    }

    /**
     * Block client Internet access
     */
    async block(ip: string): Promise<void> {

        try {

            await this.run(
                `${IPSET} del skygrid_clients ${ip}`
            );

        } catch {
            // Ignore if IP is already removed
        }

        console.log(`❌ Blocked Client: ${ip}`);

    }

    /**
     * Check if client is already allowed
     */
    async exists(ip: string): Promise<boolean> {

        try {

            await this.run(
                `${IPSET} test skygrid_clients ${ip}`
            );

            return true;

        } catch {

            return false;

        }

    }

    /**
     * List all allowed clients
     */
    async list(): Promise<string> {

        return await this.run(
            `${IPSET} list skygrid_clients`
        );

    }

    /**
     * Remove all clients
     */
    async clear(): Promise<void> {

        await this.run(
            `${IPSET} flush skygrid_clients`
        );

        console.log("🧹 Cleared all captive clients");

    }

    /**
 * Restore all active sessions to ipset after server reboot
 */
async restoreActiveClients(): Promise<void> {

    console.log("🔄 Restoring active clients to ipset...");

    try {

        /*
         * Make sure the ipset exists.
         */
        await this.run(
            `${IPSET} create skygrid_clients hash:ip -exist`
        );

        /*
         * Get all active sessions.
         */
        const sessions =
            await prisma.session.findMany({

                where: {
                    isActive: true
                },

                select: {
                    id: true,
                    ipAddress: true,
                    isPaused: true,
                    expiresAt: true,
                    remainingSeconds: true
                }

            });

        console.log(
            `🔎 Found ${sessions.length} active session(s).`
        );

        const now = Date.now();

        for (const session of sessions) {

            /*
             * Never restore paused sessions.
             */
            if (session.isPaused) {

                console.log(
                    `⏸️ Skipping paused client: ${session.ipAddress}`
                );

                continue;
            }

            /*
             * Validate IP.
             */
            if (!session.ipAddress) {

                console.log(
                    `⚠️ Skipping session ${session.id}: no IP address`
                );

                continue;
            }

            /*
             * Check expiration.
             */
            if (
                session.expiresAt &&
                session.expiresAt.getTime() <= now
            ) {

                console.log(
                    `⌛ Expired client: ${session.ipAddress}`
                );

                /*
                 * Mark expired session inactive.
                 */
                await prisma.session.update({

                    where: {
                        id: session.id
                    },

                    data: {
                        isActive: false,
                        remainingSeconds: 0
                    }

                });

                continue;
            }

            /*
             * Restore Internet access.
             */
            await this.run(
                `${IPSET} add skygrid_clients ${session.ipAddress} -exist`
            );

            console.log(
                `✅ Restored Internet: ${session.ipAddress}`
            );
        }

        console.log(
            "✅ Active clients restored to ipset."
        );

    } catch (err) {

        console.error(
            "❌ Failed to restore active clients:",
            err
        );

    }

}

}

export const ipsetService = new IPSetService();