"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voucherController = void 0;
const voucher_service_1 = require("../services/voucher.service");
class VoucherController {
    async generate(req, res) {
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
                const voucher = await voucher_service_1.voucherService.generate(packageId);
                vouchers.push(voucher);
            }
            return res.json({
                success: true,
                message: `${quantity} voucher(s) generated successfully`,
                data: vouchers
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getAll(req, res) {
        try {
            const vouchers = await voucher_service_1.voucherService.getAll();
            return res.json({
                success: true,
                data: vouchers
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.voucherController = new VoucherController();
