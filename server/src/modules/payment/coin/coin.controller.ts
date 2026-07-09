import { Request, Response } from "express";
import { coinService } from "./coin.service";

class CoinController {

    async insert(req: Request, res: Response) {

        try {

            const {

                machineId,
                clientMac,
                clientIP,
                amount

            } = req.body;

            const result =
                await coinService.insertCoin(

                    machineId,
                    clientMac,
                    clientIP,
                    Number(amount)

                );

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