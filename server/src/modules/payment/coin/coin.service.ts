import prisma from "../../../config/prisma";
import { sessionService } from "../../captive/session/session.service";
import { convertToMinutes } from "../../../utils/time";

class CoinService {

    /**
     * Load SubVendo + Machine
     */
    private async getMachineFromChipId(chipId: string) {

        const subVendo = await prisma.subVendo.findUnique({

            where: {
                chipId
            },

            include: {
                machine: true
            }

        });

        if (!subVendo) {
            throw new Error("SubVendo not found.");
        }

        if (!subVendo.machine) {
            throw new Error("Machine not found.");
        }

        return subVendo.machine;
    }

    /**
     * Portal -> Waiting for coin
     */
    async waitClient(data: any) {

    const {

        clientIP,
        clientMac

    } = data;

    const machine =
        await this.getCurrentMachine();

    // Remove previous waiting request
    await prisma.waitingClient.deleteMany({

        where: {

            machineId: machine.id,

            clientIP

        }

    });

    // Create new waiting client
    const waiting =
        await prisma.waitingClient.create({

            data: {

                machineId: machine.id,

                clientIP,

                clientMac

            }

        });

    console.log("========== WAIT CLIENT ==========");
    console.log("Machine :", machine.name);
    console.log("Machine ID :", machine.id);
    console.log("Client IP :", clientIP);
    console.log("Client MAC :", clientMac);
    console.log("=================================");

    return {

        success: true,

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

        console.log("========== COIN ==========");
        console.log("Chip :", chipId);
        console.log("Amount :", amount);

        const machine =
            await this.getMachineFromChipId(chipId);

        const waiting =
    await prisma.waitingClient.findFirst({

        where: {

            machineId: machine.id,

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

console.log("========== WAITING CLIENT ==========");
console.log("ID:", waiting.id);
console.log("IP:", waiting.clientIP);
console.log("MAC:", waiting.clientMac);
console.log("====================================");

        const pkg =
            await prisma.package.findFirst({

                where: {

                    price: Number(amount),

                    isActive: true

                }

            });

        if (!pkg) {
            throw new Error(`No package configured for ₱${amount}`);
        }

        if (!waiting.clientMac) {
    throw new Error("Waiting client has no MAC address.");
}

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

        await prisma.coinTransaction.create({

            data: {

                machineId: machine.id,

                sessionId: session.id,

                amount: pkg.price

            }

        });

        await prisma.waitingClient.delete({

            where: {

                id: waiting.id

            }

        });

        return {

            success: true,

            session

        };

    }

    private async getCurrentMachine() {

    const machine = await prisma.machine.findFirst({
        where: {
            status: "ONLINE" // o isActive:true kung meron
        }
    });

    if (!machine) {
        throw new Error("No active machine.");
    }

    return machine;
}

}

export const coinService = new CoinService();