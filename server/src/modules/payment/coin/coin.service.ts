import prisma from "../../../config/prisma";
import { sessionService } from "../../captive/session/session.service";
import { Prisma } from "@prisma/client";

class CoinService {

    /**
     * Get the active Main Vendo machine or SubVendo machine by Chip/MAC
     */
    private async getCurrentMachine(chipId?: string) {
        if (chipId) {
            // Unang hanapin kung tumutugma sa Sub Vendo / Machine sa DB
            const subVendo = await prisma.machine.findFirst({
                where: {
                    OR: [
                        { chipId: chipId },
                        { macAddress: chipId }
                    ]
                }
            });
            if (subVendo) return subVendo;
        }

        // Fallback sa Main Vendo Machine
        const machine = await prisma.machine.findFirst({
            where: {
                status: "ONLINE"
            }
        });

        if (!machine) {
            throw new Error("No active Vendo machine found.");
        }

        return machine;
    }


    /**
     * Portal -> Waiting for coin
     */
    async waitClient(data: any) {
        const { clientIP, clientMac } = data;

        if (!clientIP || !clientMac) {
            throw new Error("Client IP and MAC address are required.");
        }

        const machine = await this.getCurrentMachine();

        /**
         * Remove old waiting requests from the same client IP/MAC
         */
        await prisma.waitingClient.deleteMany({
            where: {
                OR: [
                    { clientIP },
                    { clientMac }
                ]
            }
        });

        /**
         * Create new waiting client record (With initial amount 0)
         */
        const waiting = await prisma.waitingClient.create({
            data: {
                machineId: machine.id,
                clientIP,
                clientMac,
                amountInserted: 0 // Tiyaking may amountInserted field sa schema kung gagamitin sa modal display
            } as any
        });

        console.log("========== WAIT CLIENT START ==========");
        console.log("Machine:", machine.name);
        console.log("Client IP:", clientIP);
        console.log("Client MAC:", clientMac);
        console.log("Waiting ID:", waiting.id);
        console.log("=======================================");

        return {
            success: true,
            waiting
        };
    }


    /**
     * GET current total inserted amount for the waiting modal (Portal API)
     */
    async getAmountInserted(clientIP: string) {
        if (!clientIP) return { amount: 0 };

        const waiting = await prisma.waitingClient.findFirst({
            where: { clientIP },
            orderBy: { createdAt: "desc" }
        });

        return {
            amount: (waiting as any)?.amountInserted || 0
        };
    }


    /**
     * ESP8266 / Sub Vendo -> Coin inserted
     */
    async insertCoin(data: any) {
        const { chipId, amount } = data;

        console.log("========== COIN INSERT ==========");
        console.log("Chip ID / SubVendo:", chipId);
        console.log("Amount:", amount);

        if (!chipId) {
            throw new Error("Subvendo chipId is required.");
        }

        if (!amount || Number(amount) <= 0) {
            throw new Error("Invalid coin amount.");
        }

        const machine = await this.getCurrentMachine(chipId);

        /**
         * Find latest active waiting client
         */
        const waiting = await prisma.waitingClient.findFirst({
            where: {
                clientIP: { not: "" },
                clientMac: { not: "" }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        if (!waiting) {
            throw new Error("No waiting client session active. Please click 'Insert Coin' on screen first.");
        }

        console.log("========== MATCHED CLIENT ==========");
        console.log("Waiting ID:", waiting.id);
        console.log("Client IP:", waiting.clientIP);
        console.log("Client MAC:", waiting.clientMac);

        /**
         * Find configured coin rate
         */
        const rate = await prisma.coinRate.findUnique({
            where: {
                amount: new Prisma.Decimal(amount)
            }
        });

        if (!rate || !rate.enabled) {
            throw new Error(`No active coin rate configured for ₱${amount}`);
        }

        /**
         * Convert duration to minutes
         */
        let durationMinutes = 0;
        switch (rate.durationUnit) {
            case "MINUTE":
                durationMinutes = rate.duration;
                break;
            case "HOUR":
                durationMinutes = rate.duration * 60;
                break;
            case "DAY":
                durationMinutes = rate.duration * 24 * 60;
                break;
            default:
                throw new Error("Unsupported coin rate duration unit.");
        }

        /**
         * Find default package
         */
        const defaultPackage = await prisma.package.findFirst({
            where: { isActive: true },
            orderBy: { price: "asc" }
        });

        if (!defaultPackage) {
            throw new Error("No active package configured.");
        }

        /**
         * Add/Extend session for client
         */
        const session = await sessionService.createSession(
            machine.id,
            defaultPackage.id,
            waiting.clientMac,
            waiting.clientIP,
            durationMinutes
        );

        /**
         * Record coin transaction
         */
        await prisma.coinTransaction.create({
            data: {
                machineId: machine.id,
                sessionId: session.id,
                amount: rate.amount
            }
        });

        /**
         * UPDATE total amount inserted instead of deleting immediately!
         * (Or update lastActive / keep waiting record active)
         */
        if ('amountInserted' in waiting) {
            await prisma.waitingClient.update({
                where: { id: waiting.id },
                data: {
                    amountInserted: { increment: Number(amount) }
                } as any
            });
        }

        console.log("✅ COIN SUCCESS: Added", durationMinutes, "mins to IP", waiting.clientIP);

        return {
            success: true,
            session
        };
    }
}

export const coinService = new CoinService();