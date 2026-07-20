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

        try {

            const {

                chipId,
                amount

            } = req.body;

            const result =
                await coinService.insertCoin({

                    chipId,
                    amount: Number(amount)

                });

            return res.json(result);

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