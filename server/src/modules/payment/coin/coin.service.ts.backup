import prisma from "../../../config/prisma";
import { sessionService } from "../../captive/session/session.service";
import { convertToMinutes } from "../../../utils/time";

class CoinService {

    /**
     * Get the active Main Vendo machine.
     *
     * Subvendo no longer has a machineId relation.
     * The Main Vendo server itself is the machine that owns
     * the captive portal, sessions, and coin transactions.
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
     * Portal -> Waiting for coin
     *
     * Called when a client opens the coin portal.
     */
    async waitClient(data: any) {

        const {

            clientIP,
            clientMac

        } = data;


        const machine =
            await this.getCurrentMachine();


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
         * Create new waiting client.
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
            "Machine:",
            machine.name
        );

        console.log(
            "Machine ID:",
            machine.id
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
            "================================="
        );


        return {

            success:
                true,

            waiting

        };

    }


    /**
     * ESP8266 -> Coin inserted
     *
     * Subvendo identifies itself using chipId.
     * The actual Main Vendo machine is automatically
     * resolved using getCurrentMachine().
     */
    async insertCoin(data: any) {

        const {

            chipId,

            amount

        } = data;


        console.log(
            "========== COIN =========="
        );

        console.log(
            "Chip:",
            chipId
        );

        console.log(
            "Amount:",
            amount
        );


        /**
         * Verify that the Subvendo exists.
         */
        const subVendo =
            await prisma.subVendo.findUnique({

                where: {

                    chipId

                }

            });


        if (!subVendo) {

            throw new Error(
                "Subvendo not registered."
            );

        }


        /**
         * Optional safety check:
         * only configured and enabled Subvendo
         * devices can insert coins.
         */
        if (
            subVendo.status !==
                "CONFIGURED" ||

            !subVendo.enabled
        ) {

            throw new Error(
                "Subvendo is not authorized."
            );

        }


        /**
         * Find the current Main Vendo machine.
         */
        const machine =
            await this.getCurrentMachine();


        console.log(
            "Subvendo:",
            subVendo.chipId
        );

        console.log(
            "Main Vendo Machine:",
            machine.id
        );


        /**
         * Find the latest waiting client
         * assigned to the Main Vendo.
         */
        const waiting =
            await prisma.waitingClient.findFirst({

                where: {

                    machineId:
                        machine.id,

                    clientMac: {

                        not: ""

                    }

                },

                orderBy: {

                    createdAt:
                        "desc"

                }

            });


        if (!waiting) {

            throw new Error(
                "No waiting client with valid MAC address."
            );

        }


        console.log(
            "========== WAITING CLIENT =========="
        );

        console.log(
            "ID:",
            waiting.id
        );

        console.log(
            "IP:",
            waiting.clientIP
        );

        console.log(
            "MAC:",
            waiting.clientMac
        );

        console.log(
            "===================================="
        );


        /**
         * Find package based on inserted coin amount.
         */
        const pkg =
            await prisma.package.findFirst({

                where: {

                    price:
                        Number(amount),

                    isActive:
                        true

                }

            });


        if (!pkg) {

            throw new Error(
                `No package configured for ₱${amount}`
            );

        }


        /**
         * Create internet session.
         */
        const session =
            await sessionService.createSession(

                machine.id,

                pkg.id,

                waiting.clientMac,

                waiting.clientIP,

                convertToMinutes(

                    pkg.duration,

                    pkg.durationUnit

                )

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
                    pkg.price

            }

        });


        /**
         * Remove waiting client after
         * successful session creation.
         */
        await prisma.waitingClient.delete({

            where: {

                id:
                    waiting.id

            }

        });


        console.log(
            "========== COIN SUCCESS =========="
        );

        console.log(
            "Subvendo:",
            subVendo.chipId
        );

        console.log(
            "Machine:",
            machine.id
        );

        console.log(
            "Session:",
            session.id
        );

        console.log(
            "Package:",
            pkg.name
        );

        console.log(
            "=================================="
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