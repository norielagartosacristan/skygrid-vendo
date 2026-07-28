import { Request, Response } from "express";
import { coinService } from "./coin.service";
import prisma from "../../../config/prisma";

class CoinController {

    /**
     * Portal requests waiting for coin
     */
    async wait(req: Request, res: Response) {

        try {

            const {

                chipId,
                clientIP,
                clientMac

            } = req.body;

            const result =
                await coinService.waitClient({

                    chipId,
                    clientIP,
                    clientMac

                });

            return res.json(result);

        } catch (err: any) {

            return res.status(400).json({

                success: false,
                message: err.message

            });

        }

    }

    /**
     * ESP8266 sends inserted coin
     */
    async insert(req: Request, res: Response) {

    console.log("========== INSERT COIN REQUEST ==========");
    console.log("BODY:", req.body);

    try {

        const {
            chipId,
            amount
        } = req.body;

        console.log("Chip ID:", chipId);
        console.log("Amount:", amount);

        const result =
            await coinService.insertCoin({

                chipId,

                amount: Number(amount)

            });

        console.log("INSERT RESULT:", result);

        return res.json(result);

    } catch (err: any) {

        console.error(
            "INSERT COIN ERROR:",
            err
        );

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

/**
 * ESP8266 checks if there is a client waiting for coin
 */
async waiting(
    req: Request,
    res: Response
) {

    try {

        const chipId =
            Array.isArray(req.params.chipId)
                ? req.params.chipId[0]
                : req.params.chipId;


        if (!chipId) {

            return res.status(400).json({

                success: false,

                message:
                    "Chip ID is required."

            });

        }


        console.log(
            "========== CHECK WAITING CLIENT =========="
        );

        console.log(
            "Chip ID:",
            chipId
        );


        const result =
            await coinService.checkWaitingClient(
                chipId
            );


        console.log(
            "WAITING RESULT:",
            result
        );


        return res.json(
            result
        );

    } catch (err: any) {

        console.error(
            "CHECK WAITING CLIENT ERROR:",
            err
        );


        return res.status(400).json({

            success: false,

            message:
                err.message

        });

    }

}

async cancelClient(req: Request, res: Response) {
    try {
        const { clientIP } = req.body;

        if (!clientIP) {
            return res.status(400).json({
                success: false,
                message: "Client IP is required."
            });
        }

        await prisma.waitingClient.deleteMany({
            where: {
                clientIP
            }
        });

        return res.json({
            success: true,
            message: "Coin session cancelled."
        });

    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}
}

export const coinController =
    new CoinController();