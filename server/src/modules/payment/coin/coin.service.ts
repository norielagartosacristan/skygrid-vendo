import prisma from "../../../config/prisma";
import { sessionService } from "../../captive/session/session.service";
import { convertToMinutes } from "../../../utils/time";
import { machineService } from "../../machine/services/machine.service";
import {
    InsertCoinRequest,
    InsertCoinResponse
} from "./coin.types";
import { ipsetService } from "../../captive/firewall/ipset.service";

class CoinService {

   async insertCoin(
    data: InsertCoinRequest
): Promise<InsertCoinResponse> {

    try {

        const {
            clientMac,
            clientIP,
            amount
        } = data;

        console.log("========== COIN INSERTED ==========");
        console.log("Client:", clientIP);
        console.log("Amount:", amount);

        console.log("Looking for package...");

        const pkg = await prisma.package.findFirst({
            where: {
                price: Number(amount),
                isActive: true
            }
        });

        console.log("Package:", pkg);

        if (!pkg) {
            throw new Error(
                `No package configured for ₱${amount}`
            );
        }

        console.log("Loading current machine...");

        const machine =
            await machineService.getCurrentMachine();

        console.log("Machine:", machine);

        if (!machine) {
            throw new Error("Machine not registered.");
        }

        console.log("Creating session...");

        const session =
            await sessionService.createSession(
                machine.id,
                pkg.id,
                clientMac,
                clientIP,
                convertToMinutes(
                    pkg.duration,
                    pkg.durationUnit
                )
            );
            
        console.log("Session:", session);
           // await ipsetService.allow(clientIP);
        await prisma.coinTransaction.create({
            data: {
                machineId: machine.id,
                sessionId: session.id,
                amount: pkg.price
            }
        });

        console.log("Coin transaction saved.");

        return {
            success: true,
            session
        };

    } catch (err) {

        console.error("COIN ERROR:", err);

        throw err;

    }

}
}

export const coinService =
    new CoinService();