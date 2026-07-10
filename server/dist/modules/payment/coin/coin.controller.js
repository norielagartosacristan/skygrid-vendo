"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinController = void 0;
const coin_service_1 = require("./coin.service");
class CoinController {
    async insert(req, res) {
        try {
            const { machineId, clientMac, clientIP, amount } = req.body;
            const result = await coin_service_1.coinService.insertCoin(machineId, clientMac, clientIP, Number(amount));
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
exports.coinController = new CoinController();
