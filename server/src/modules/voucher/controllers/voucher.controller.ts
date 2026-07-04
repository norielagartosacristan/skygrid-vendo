import { Request, Response } from "express";
import { voucherService } from "../services/voucher.service";

class VoucherController {

    async generate(req: Request, res: Response) {

        try {

            const { packageId } = req.body;

            const voucher = await voucherService.generate(packageId);

            res.json({
                success: true,
                voucher
            });

        } catch (err: any) {

            res.status(400).json({
                success: false,
                message: err.message
            });

        }

    }

}

export const voucherController = new VoucherController();