import prisma from "../../../config/prisma";
import { sessionService } from "../../captive/session/session.service";
import { convertToMinutes } from "../../../utils/time";
import { machineService } from "../../machine/services/machine.service";
import {
    InsertCoinRequest,
    InsertCoinResponse
} from "./coin.types";

class CoinService {

   async insertCoin(
    data: InsertCoinRequest
): Promise<InsertCoinResponse> {

    const {
        clientMac,
        clientIP,
        amount
    } = data;

        console.log("========== COIN INSERTED ==========");
        //console.log("Machine:", machineId);
        console.log("Client:", clientIP);
        console.log("Amount:", amount);

        const pkg = await prisma.package.findFirst({

            where: {

                price: Number(amount),
                isActive: true

            }

        });

        if (!pkg) {

            throw new Error(
                `No package configured for ₱${amount}`
            );

        }

        const machine = await machineService.getCurrentMachine();

if (!machine) {
    throw new Error("Machine not registered.");
}

const machineId = machine.id;

        const session =
            await sessionService.createSession(

                machineId,
                pkg.id,
                clientMac,
                clientIP,
                convertToMinutes(
                    pkg.duration,
                    pkg.durationUnit
                )

            );

        await prisma.coinTransaction.create({

            data: {

                machineId,

                sessionId: session.id,

                amount: pkg.price

            }

        });

        console.log(
            `💰 Coin transaction saved: ₱${pkg.price}`
        );

        return {

            success: true,

            session

        };

    }

}

export const coinService =
    new CoinService();