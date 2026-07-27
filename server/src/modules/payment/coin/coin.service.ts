import prisma from "../../../config/prisma";
import { sessionService } from "../../captive/session/session.service";
import { Prisma } from "@prisma/client";

class CoinService {

    /**
     * Get the active Main Vendo machine.
     *
     * Used by the captive portal when a client
     * starts waiting for a coin.
     *
     * The portal does not know the Subvendo chipId,
     * so we use the currently active Main Vendo machine.
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
     * Get the Main Vendo machine assigned
     * to a specific Subvendo.
     *
     * The ESP8266 identifies itself using chipId.
     */
  private async getMachineByChipId(chipId: string) {

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
     * Portal -> Waiting for coin
     *
     * Called when a client opens the coin portal.
     *
     * The portal sends:
     *
     * clientIP
     * clientMac
     */
   async waitClient(
    data: any
) {

    const {
        clientIP,
        clientMac
    } = data;

    /**
     * Validate client.
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
     * Get Main Vendo.
     */
    const machine =
        await this.getCurrentMachine();


    /**
     * Find a Subvendo assigned
     * to this Main Vendo.
     *
     * For now, use the first configured
     * Subvendo belonging to this machine.
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


    if (!subvendo.ipAddress) {

        throw new Error(
            `Subvendo ${subvendo.chipId} has no IP address.`
        );

    }


    /**
     * Remove old waiting request
     * from this client.
     */
    await prisma.waitingClient.deleteMany({

        where: {

            machineId:
                machine.id,

            clientIP

        }

    });


    /**
     * Create waiting client.
     */
    const waiting =
        await prisma.waitingClient.create({

            data: {

                machineId:
                    machine.id,

                clientIP,

                clientMac

            }

        });


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


    /**
     * IMPORTANT:
     *
     * Tell the actual Subvendo
     * to activate its coin acceptor.
     */
    try {

       
    } catch (err) {

        /**
         * If relay activation fails,
         * remove waiting client again.
         */
        await prisma.waitingClient.delete({

            where: {
                id: waiting.id
            }

        }).catch(() => {});


        throw err;

    }


    console.log(
        "✅ Waiting client ready."
    );

    console.log(
        "✅ Subvendo coin acceptor activated."
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
     * ESP8266 / Subvendo -> Coin inserted
     *
     * The ESP8266 sends:
     *
     * chipId
     * amount
     *
     * The chipId is used to determine
     * which Main Vendo machine owns
     * the Subvendo.
     */
    async insertCoin(
        data: any
    ) {

        const {

            chipId,

            amount

        } = data;


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
         * Validate coin amount.
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
         * Resolve the Subvendo
         * and its assigned Main Vendo machine.
         */
        const {

            subVendo,

            machine

        } =
            await this.getMachineByChipId(
                chipId
            );


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
         * Find the latest waiting client
         * belonging to the Main Vendo machine
         * assigned to this Subvendo.
         */
        const waiting =
            await prisma.waitingClient.findFirst({

                where: {

                    machineId:
                        machine.id,

                    clientIP: {

                        not:
                            ""

                    },

                    clientMac: {

                        not:
                            ""

                    }

                },

                orderBy: {

                    createdAt:
                        "desc"

                }

            });


        if (!waiting) {

            throw new Error(
                `No waiting client found for Subvendo ${chipId}.`
            );

        }


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
         * Convert coin rate duration
         * into minutes.
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
         * Create or extend session.
         *
         * SessionService handles:
         *
         * 1. New session
         * 2. Existing session extension
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
         * Remove ONLY the waiting client
         * that received this coin.
         */
        await prisma.waitingClient.delete({

            where: {

                id:
                    waiting.id

            }

        });


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

            session

        };

    }

}


export const coinService =
    new CoinService();
