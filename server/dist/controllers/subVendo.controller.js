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
const SubVendoService = __importStar(require("../services/subVendo.service"));
async function register(req, res) {
    try {
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
        const device = await SubVendoService.configureDevice(req.params.id, req.body);
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
