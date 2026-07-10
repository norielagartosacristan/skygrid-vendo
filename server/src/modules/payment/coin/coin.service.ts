import prisma from "../../../config/prisma";
import { sessionService } from "../../captive/session/session.service";

class CoinService {

    async insertCoin(
        machineId: string,
        clientMac: string,
        clientIP: string,
        amount: number
    ) {

        console.log("========== COIN INSERTED ==========");
        console.log("Amount:", amount);

        const pkg = await prisma.package.findFirst({

            where: {

                price: amount,
                isActive: true

            }

        });

        if (!pkg) {

            throw new Error(
                `No package configured for ₱${amount}`
            );

        }

        const session =
            await sessionService.createSession(

                machineId,
                pkg.id,
                clientMac,
                clientIP,
                pkg.duration

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