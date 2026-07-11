import { Request, Response } from "express";
import { paymentService } from "./payment.service";

class PaymentController {

    async process(req: Request, res: Response) {

        try {

            const {
                machineId,
                packageId,
                clientMac,
                clientIP,
                durationMinutes
            } = req.body;

            const result =
                await paymentService.processPayment(
                    machineId,
                    packageId,
                    clientMac,
                    clientIP,
                    Number(durationMinutes)
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

export const paymentController =
    new PaymentController();