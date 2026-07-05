import { Request, Response } from "express";
import { voucherService } from "../services/voucher.service";

class VoucherController {

    async generate(req: Request, res: Response) {

        try {

            const { packageId, quantity = 1 } = req.body;

            if (!packageId) {
                return res.status(400).json({
                    success: false,
                    message: "packageId is required"
                });
            }

            const vouchers = [];

            for (let i = 0; i < quantity; i++) {

                const voucher =
                    await voucherService.generate(packageId);

                vouchers.push(voucher);

            }

            return res.json({

                success: true,

                message: `${quantity} voucher(s) generated successfully`,

                data: vouchers

            });

        } catch (error: any) {

            return res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

    async getAll(req: Request, res: Response) {

    try {

        const vouchers =
            await voucherService.getAll();

        return res.json({

            success: true,

            data: vouchers

        });

    }

    catch (error: any) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

}

export const voucherController =
    new VoucherController();