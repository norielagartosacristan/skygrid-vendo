import prisma from "../../../config/prisma";
import { sessionService } from "../../captive/session/session.service";
import { Prisma } from "@prisma/client";

class CoinService {

    /**
     * ==========================================
     * GET CURRENT MAIN VENDO
     * ==========================================
     */
    private async getCurrentMachine() {

        const machine =
            await prisma.machine.findFirst({
                where: {
                    status: "ONLINE"
                }
            });

        if (!machine) {
            throw new Error(
                "No active Main Vendo machine found."
            );
        }

        return machine;
    }


    /**
     * ==========================================
     * GET MACHINE BY SUBVENDO CHIP ID
     * ==========================================
     */
    private async getMachineByChipId(
        chipId: string
    ) {

        const subvendo =
            await prisma.subVendo.findUnique({

                where: {
                    chipId
                },

                include: {
                    machine: true
                }

            });

        if (!subvendo) {

            throw new Error(
                `Subvendo ${chipId} not found.`
            );

        }

        if (!subvendo.machine) {

            throw new Error(
                `Subvendo ${chipId} is not assigned to a Main Vendo machine.`
            );

        }

        return {
            subVendo: subvendo,
            machine: subvendo.machine
        };
    }


    /**
     * ==========================================
     * PORTAL -> WAITING FOR COIN
     * ==========================================
     *
     * Called when the client clicks Insert Coin.
     *
     * Creates a WaitingClient record that expires
     * automatically after 30 seconds.
     */
    async waitClient(
        data: any
    ) {

        const {
            clientIP,
            clientMac
        } = data;


        /**
         * Validate client information.
         */
        if (
            !clientIP ||
            !clientMac
        ) {

            throw new Error(
                "Client IP and MAC address are required."
            );

        }


        /**
         * Get active Main Vendo.
         */
        const machine =
            await this.getCurrentMachine();


        /**
         * Find an available Subvendo.
         */
        const subvendo =
            await prisma.subVendo.findFirst({

                where: {

                    machineId:
                        machine.id,

                    enabled:
                        true,

                    status:
                        "CONFIGURED"

                }

            });


        if (!subvendo) {

            throw new Error(
                "No configured Subvendo found."
            );

        }


        /**
         * Make sure Subvendo has IP.
         */
        if (!subvendo.ipAddress) {

            throw new Error(
                `Subvendo ${subvendo.chipId} has no IP address.`
            );

        }


        /**
         * Remove previous waiting request
         * from the same client.
         */
        await prisma.waitingClient.deleteMany({

            where: {

                machineId:
                    machine.id,

                clientIP

            }

        });


        /**
         * Waiting session expires after 30 seconds.
         */
        const expiresAt =
            new Date(
                Date.now() +
                30 * 1000
            );


        /**
         * Create WaitingClient.
         */
        const waiting =
            await prisma.waitingClient.create({

                data: {

                    machineId:
                        machine.id,

                    clientIP,

                    clientMac,

                    expiresAt

                }

            });


        console.log();
        console.log(
            "========== WAIT CLIENT =========="
        );

        console.log(
            "Main Vendo:",
            machine.name
        );

        console.log(
            "Machine ID:",
            machine.id
        );

        console.log(
            "Subvendo:",
            subvendo.chipId
        );

        console.log(
            "Subvendo IP:",
            subvendo.ipAddress
        );

        console.log(
            "Client IP:",
            clientIP
        );

        console.log(
            "Client MAC:",
            clientMac
        );

        console.log(
            "Waiting ID:",
            waiting.id
        );

        console.log(
            "Expires At:",
            waiting.expiresAt
        );

        console.log(
            "================================="
        );


        return {

            success:
                true,

            waiting,

            subvendo: {

                chipId:
                    subvendo.chipId,

                ipAddress:
                    subvendo.ipAddress

            }

        };

    }


    /**
     * ==========================================
     * ESP8266 / SUBVENDO -> COIN INSERTED
     * ==========================================
     */
    async insertCoin(
        data: any
    ) {

        const {
            chipId,
            amount
        } = data;


        console.log();
        console.log(
            "========== COIN INSERT =========="
        );

        console.log(
            "Chip ID:",
            chipId
        );

        console.log(
            "Amount:",
            amount
        );


        /**
         * Validate chipId.
         */
        if (!chipId) {

            throw new Error(
                "Subvendo chipId is required."
            );

        }


        /**
         * Validate amount.
         */
        if (
            !amount ||
            Number(amount) <= 0
        ) {

            throw new Error(
                "Invalid coin amount."
            );

        }


        /**
         * Resolve Subvendo
         * and Main Vendo machine.
         */
        const {
            subVendo,
            machine
        } =
            await this.getMachineByChipId(
                chipId
            );


        console.log();
        console.log(
            "========== SUBVENDO =========="
        );

        console.log(
            "Chip ID:",
            subVendo.chipId
        );

        console.log(
            "Subvendo MAC:",
            subVendo.macAddress
        );

        console.log(
            "Subvendo IP:",
            subVendo.ipAddress
        );

        console.log(
            "Main Vendo Machine:",
            machine.name
        );

        console.log(
            "Machine ID:",
            machine.id
        );

        console.log(
            "=============================="
        );


        /**
         * Remove expired waiting clients
         * before searching.
         */
        await prisma.waitingClient.deleteMany({

            where: {

                expiresAt: {
                    lt: new Date()
                }

            }

        });


        /**
         * Find latest active waiting client.
         */
        const waiting =
            await prisma.waitingClient.findFirst({

                where: {

                    machineId:
                        machine.id,

                    expiresAt: {
                        gt: new Date()
                    },

                    clientIP: {
                        not: ""
                    },

                    clientMac: {
                        not: ""
                    }

                },

                orderBy: {

                    createdAt:
                        "desc"

                }

            });


        /**
         * No waiting client.
         */
        if (!waiting) {

            throw new Error(
                `No active waiting client found for Subvendo ${chipId}.`
            );

        }


        console.log();
        console.log(
            "========== WAITING CLIENT =========="
        );

        console.log(
            "Waiting ID:",
            waiting.id
        );

        console.log(
            "Client IP:",
            waiting.clientIP
        );

        console.log(
            "Client MAC:",
            waiting.clientMac
        );

        console.log(
            "Machine ID:",
            waiting.machineId
        );

        console.log(
            "Expires At:",
            waiting.expiresAt
        );

        console.log(
            "===================================="
        );


        /**
         * Find configured coin rate.
         */
        const rate =
            await prisma.coinRate.findUnique({

                where: {

                    amount:
                        new Prisma.Decimal(
                            amount
                        )

                }

            });


        if (
            !rate ||
            !rate.enabled
        ) {

            throw new Error(
                `No coin rate configured for ₱${amount}.`
            );

        }


        /**
         * Convert duration to minutes.
         */
        let durationMinutes =
            0;


        switch (
            rate.durationUnit
        ) {

            case "MINUTE":

                durationMinutes =
                    rate.duration;

                break;


            case "HOUR":

                durationMinutes =
                    rate.duration *
                    60;

                break;


            case "DAY":

                durationMinutes =
                    rate.duration *
                    24 *
                    60;

                break;


            default:

                throw new Error(
                    "Unsupported coin rate duration unit."
                );

        }


        console.log(
            "Coin:",
            `₱${rate.amount.toString()}`
        );

        console.log(
            "Duration:",
            durationMinutes,
            "minutes"
        );


        /**
         * Create or extend client session.
         *
         * IMPORTANT:
         *
         * We use the client information from
         * the existing WaitingClient record.
         */
        const session =
            await sessionService.createSession(

                machine.id,

                null,

                waiting.clientMac,

                waiting.clientIP,

                durationMinutes

            );


        /**
         * Record coin transaction.
         */
        await prisma.coinTransaction.create({

            data: {

                machineId:
                    machine.id,

                sessionId:
                    session.id,

                amount:
                    rate.amount

            }

        });


        /**
         * Remove the waiting client
         * after successful coin processing.
         *
         * This prevents the same coin session
         * from being processed again.
         */
        await prisma.waitingClient.delete({

            where: {

                id:
                    waiting.id

            }

        });


        console.log();
        console.log(
            "===================================="
        );

        console.log(
            "✅ COIN SUCCESS"
        );

        console.log(
            "Subvendo:",
            chipId
        );

        console.log(
            "Machine:",
            machine.name
        );

        console.log(
            "Client IP:",
            waiting.clientIP
        );

        console.log(
            "Client MAC:",
            waiting.clientMac
        );

        console.log(
            "Added:",
            durationMinutes,
            "minutes"
        );

        console.log(
            "Session ID:",
            session.id
        );

        console.log(
            "Expires:",
            session.expiresAt
        );

        console.log(
            "===================================="
        );


        return {

    success:
        true,

    amount:
        Number(
            rate.amount.toString()
        ),

    session

};
    }


    /**
     * ==========================================
     * SUBVENDO -> CHECK WAITING CLIENT
     * ==========================================
     */
    async checkWaitingClient(
        chipId: string
    ) {

        console.log();
        console.log(
            "========== CHECK WAITING CLIENT =========="
        );

        console.log(
            "Subvendo Chip ID:",
            chipId
        );


        /**
         * Find Subvendo.
         */
        const subvendo =
            await prisma.subVendo.findUnique({

                where: {

                    chipId

                }

            });


        /**
         * Make sure Subvendo exists.
         */
        if (!subvendo) {

            throw new Error(
                `Subvendo ${chipId} not found.`
            );

        }


        /**
         * Make sure Subvendo
         * is assigned to Main Vendo.
         */
        if (!subvendo.machineId) {

            throw new Error(
                `Subvendo ${chipId} is not assigned to a Main Vendo machine.`
            );

        }


        const machineId =
            subvendo.machineId;


        /**
         * Remove expired waiting clients.
         */
        await prisma.waitingClient.deleteMany({

            where: {

                expiresAt: {
                    lt: new Date()
                }

            }

        });


        /**
         * Find active waiting client.
         */
        const waiting =
            await prisma.waitingClient.findFirst({

                where: {

                    machineId,

                    expiresAt: {
                        gt: new Date()
                    },

                    clientIP: {
                        not: ""
                    },

                    clientMac: {
                        not: ""
                    }

                },

                orderBy: {

                    createdAt:
                        "desc"

                }

            });


        /**
         * No active waiting client.
         */
        if (!waiting) {

            console.log(
                "No waiting client."
            );

            return {

                success:
                    true,

                waiting:
                    false

            };

        }


        /**
         * Active waiting client found.
         */
        console.log();
        console.log(
            "WAITING CLIENT FOUND"
        );

        console.log(
            "Waiting ID:",
            waiting.id
        );

        console.log(
            "Client IP:",
            waiting.clientIP
        );

        console.log(
            "Client MAC:",
            waiting.clientMac
        );

        console.log(
            "Expires At:",
            waiting.expiresAt
        );


        return {

            success:
                true,

            waiting:
                true,

            clientIP:
                waiting.clientIP,

            clientMac:
                waiting.clientMac,

            waitingId:
                waiting.id,

            expiresAt:
                waiting.expiresAt

        };

    }

}


export const coinService =
    new CoinService();

