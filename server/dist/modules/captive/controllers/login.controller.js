"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const captiveLogin_service_1 = require("../services/captiveLogin.service");
function normalizeIP(ip) {
    return ip.replace(/^::ffff:/, "");
}
async function login(req, res) {
    try {
        const { voucher } = req.body;
        const clientIP = normalizeIP(req.ip || "");
        const result = await captiveLogin_service_1.captiveLoginService.login({
            voucher,
            clientIP,
        });
        res.json(result);
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}
