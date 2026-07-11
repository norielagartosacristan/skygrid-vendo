"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allow = allow;
exports.block = block;
exports.clients = clients;
exports.getSession = getSession;
exports.client = client;
exports.enable = enable;
exports.disable = disable;
exports.rules = rules;
const ipset_service_1 = require("../firewall/ipset.service");
const firewallRules_service_1 = require("../firewall/firewallRules.service");
const prisma_1 = __importDefault(require("../../../config/prisma"));
async function allow(req, res) {
    try {
        const { ip } = req.body;
        if (!ip) {
            return res.status(400).json({
                message: "IP address is required"
            });
        }
        await ipset_service_1.ipsetService.allow(ip);
        res.json({
            success: true,
            message: `${ip} allowed`
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
async function block(req, res) {
    try {
        const { ip } = req.body;
        await ipset_service_1.ipsetService.block(ip);
        res.json({
            success: true,
            message: `${ip} blocked`
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
async function clients(req, res) {
    try {
        const data = await ipset_service_1.ipsetService.list();
        res.send(data);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}
async function getSession(req, res) {
    console.log("========== GET SESSION ==========");
    const ip = req.query.ip;
    console.log("IP:", ip);
    const session = await prisma_1.default.session.findFirst({
        where: {
            ipAddress: ip,
            isActive: true
        }
    });
    console.log(session);
    res.json(session);
}
async function client(req, res) {
    const ip = req.ip?.replace("::ffff:", "") ||
        req.socket.remoteAddress?.replace("::ffff:", "") ||
        "";
    res.json({ ip });
}
async function enable(req, res) {
    await firewallRules_service_1.firewallRules.initialize();
    res.json({
        success: true,
        message: "Captive Portal Enabled"
    });
}
async function disable(req, res) {
    // Mamaya natin lalagyan ng implementation
    res.json({
        success: true,
        message: "Captive Portal Disabled"
    });
}
async function rules(req, res) {
    const data = await firewallRules_service_1.firewallRules.showRules();
    res.send(data);
}
