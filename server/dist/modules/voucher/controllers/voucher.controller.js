"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voucherController = void 0;
const voucher_service_1 = require("../services/voucher.service");
class VoucherController {
    async generate(req, res) {
        try {
            const { packageId } = req.body;
            const voucher = await voucher_service_1.voucherService.generate(packageId);
            res.json({
                success: true,
                voucher
            });
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }
}
exports.voucherController = new VoucherController();
