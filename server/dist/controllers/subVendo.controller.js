"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.pending = pending;
exports.configure = configure;
exports.registered = registered;
exports.heartbeat = heartbeat;
exports.configuration = configuration;
const SubVendoService = __importStar(require("../services/subVendo.service"));
async function register(req, res) {
    try {
        console.log("BODY:", req.body);
        const device = await SubVendoService.registerDevice(req.body);
        res.json({
            message: "Device registered successfully.",
            data: device,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Unable to register device.",
        });
    }
}
async function pending(req, res) {
    try {
        const devices = await SubVendoService.getPendingDevices();
        res.json(devices);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Unable to load devices.",
        });
    }
}
async function configure(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                message: "Device ID is required.",
            });
        }
        const device = await SubVendoService.configureDevice(id, req.body);
        res.json({
            message: "Device configured successfully.",
            data: device,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Unable to configure device.",
        });
    }
}
async function registered(req, res) {
    try {
        const devices = await SubVendoService.getRegisteredDevices();
        res.json(devices);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Unable to load registered devices.",
        });
    }
}
async function heartbeat(req, res) {
    try {
        const { chipId, uptime, connectedClients, freeMemory, wifiSignal, temperature, } = req.body;
        const device = await SubVendoService.heartbeat(chipId, {
            uptime,
            connectedClients,
            freeMemory,
            wifiSignal,
            temperature,
        });
        res.json(device);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Heartbeat failed.",
        });
    }
}
async function configuration(req, res) {
    try {
        const config = await SubVendoService.getConfiguration(req.params.chipId);
        if (!config) {
            return res.status(404).json({
                message: "Device not found.",
            });
        }
        res.json(config);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Unable to load configuration.",
        });
    }
}
