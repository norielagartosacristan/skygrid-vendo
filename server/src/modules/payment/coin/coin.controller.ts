import { Request, Response } from "express";
import { coinService } from "./coin.service";

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

}

export const coinController =
    new CoinController();