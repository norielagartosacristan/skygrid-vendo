"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.heartbeat = heartbeat;
exports.config = config;
exports.approve = approve;
const subvendo_service_1 = require("../services/subvendo.service");
async function register(req, res) {
    try {
        const machine = await subvendo_service_1.subVendoService.register(req.body);
        res.json({
            success: true,
            machine
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
async function heartbeat(req, res) {
    try {
        await subvendo_service_1.subVendoService.heartbeat(req.body);
        res.json({
            success: true
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
async function config(req, res) {
    const machine = await subvendo_service_1.subVendoService.getConfig(req.params.chipId);
    res.json(machine);
}
async function approve(req, res) {
    try {
        const device = await subvendo_service_1.subVendoService.approve(req.params.id);
        res.json({
            success: true,
            device
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
