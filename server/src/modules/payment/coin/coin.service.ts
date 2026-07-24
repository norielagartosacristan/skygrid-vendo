import prisma from "../../../config/prisma";
import { sessionService } from "../../captive/session/session.service";
import { Prisma } from "@prisma/client";


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

    console.log("========== COIN ==========");
    console.log("Chip:", chipId);
    console.log("Amount:", amount);

    /**
     * Main Vendo owns the captive portal.
     * SubVendo identifies itself through chipId,
     * but currently the active Main Vendo machine
     * is used for sessions and waiting clients.
     */
    const machine =
        await this.getCurrentMachine();

    console.log(
        "Machine ID:",
        machine.id
    );

    /**
     * Find latest waiting client
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

                createdAt: "desc"

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

    /**
     * Find Coin Rate
     */
    const rate =
        await prisma.coinRate.findUnique({

            where: {

                amount:
                    new Prisma.Decimal(amount)

            }

        });

    if (!rate || !rate.enabled) {

        throw new Error(
            `No coin rate configured for ₱${amount}`
        );

    }

    /**
     * Convert Coin Rate duration to minutes
     */
    let durationMinutes = 0;

    switch (rate.durationUnit) {

        case "MINUTE":

            durationMinutes =
                rate.duration;

            break;

        case "HOUR":

            durationMinutes =
                rate.duration * 60;

            break;

        case "DAY":

            durationMinutes =
                rate.duration * 24 * 60;

            break;

        default:

            throw new Error(
                "Unsupported coin rate duration unit."
            );

    }

    console.log(
        "Coin Rate:",
        rate.amount.toString()
    );

    console.log(
        "Duration:",
        durationMinutes,
        "minutes"
    );

    /**
     * Get default active package.
     *
     * Temporary technical compatibility
     * because Session.packageId is required.
     *
     * Actual coin duration comes from CoinRate.
     */
    const defaultPackage =
        await prisma.package.findFirst({

            where: {

                isActive: true

            },

            orderBy: {

                price: "asc"

            }

        });

    if (!defaultPackage) {

        throw new Error(
            "No active package configured."
        );

    }

    /**
     * Create or extend session
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
     * Record coin transaction
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
     * Remove waiting client
     */
    await prisma.waitingClient.delete({

        where: {

            id:
                waiting.id

        }

    });

    console.log(
        "✅ COIN SESSION CREATED"
    );

    console.log(
        "Client IP:",
        waiting.clientIP
    );

    console.log(
        "Duration:",
        durationMinutes,
        "minutes"
    );

    return {

        success: true,

        session

    };

}
}


export const coinService =
    new CoinService();