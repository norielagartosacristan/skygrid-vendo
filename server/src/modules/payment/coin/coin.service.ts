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

        // Hanapin ang package na katumbas ng coin

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
                pkg.durationMinutes

            );

        return {

            success: true,
            session

        };

    }

}

export const coinService =
    new CoinService();