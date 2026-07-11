"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const payment_service_1 = require("./payment.service");
class PaymentController {
    async process(req, res) {
        try {
            const { machineId, packageId, clientMac, clientIP, durationMinutes } = req.body;
            const result = await payment_service_1.paymentService.processPayment(machineId, packageId, clientMac, clientIP, Number(durationMinutes));
            return res.json(result);
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }
}
exports.paymentController = new PaymentController();
