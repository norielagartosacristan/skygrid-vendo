import prisma from "../../../config/prisma";
import { sessionService } from "../../captive/session/session.service";
import { Prisma } from "@prisma/client";

class CoinService {

    /**
     * Get the active Main Vendo machine.
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
     */
    async waitClient(data: any) {

        const {
            clientIP,
            clientMac
        } = data;


        if (!clientIP || !clientMac) {

            throw new Error(
                "Client IP and MAC address are required."
            );

        }


        const machine =
            await this.getCurrentMachine();


        /**
         * Remove old waiting request
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
            "Waiting ID:",
            waiting.id
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
     */
    async insertCoin(data: any) {

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


        if (!chipId) {

            throw new Error(
                "Subvendo chipId is required."
            );

        }


        if (!amount || Number(amount) <= 0) {

            throw new Error(
                "Invalid coin amount."
            );

        }


        const machine =
            await this.getCurrentMachine();


        console.log(
            "Machine ID:",
            machine.id
        );


        /**
         * Find latest waiting client.
         *
         * IMPORTANT:
         * Only select waiting clients that
         * still exist.
         */
        const waiting =
            await prisma.waitingClient.findFirst({

                where: {

                    machineId:
                        machine.id,

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


        if (!waiting) {

            throw new Error(
                "No waiting client with valid MAC address."
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
                `No coin rate configured for ₱${amount}`
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
         * Find default package.
         *
         * Session.packageId is required
         * by the current database schema.
         */
        const defaultPackage =
            await prisma.package.findFirst({

                where: {

                    isActive:
                        true

                },

                orderBy: {

                    price:
                        "asc"

                }

            });


        if (!defaultPackage) {

            throw new Error(
                "No active package configured."
            );

        }


        /**
         * Create or extend session.
         *
         * SessionService already handles:
         *
         * NEW SESSION
         * or
         * EXISTING SESSION EXTENSION
         */
        const session =
            await sessionService.createSession(

                machine.id,

                defaultPackage.id,

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
         * IMPORTANT:
         *
         * Remove only the waiting record
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