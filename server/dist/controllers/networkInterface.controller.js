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
exports.getInterfaces = getInterfaces;
exports.getInterface = getInterface;
exports.createInterface = createInterface;
exports.updateInterface = updateInterface;
exports.deleteInterface = deleteInterface;
const NetworkInterfaceService = __importStar(require("../services/networkInterface.service"));
async function getInterfaces(req, res) {
    try {
        const interfaces = await NetworkInterfaceService.getInterfaces();
        res.json(interfaces);
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}
async function getInterface(req, res) {
    try {
        const { id } = req.params;
        const networkInterface = await NetworkInterfaceService.getInterface(id);
        if (!networkInterface) {
            return res.status(404).json({
                message: "Interface not found.",
            });
        }
        res.json(networkInterface);
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}
async function createInterface(req, res) {
    try {
        const networkInterface = await NetworkInterfaceService.createInterface(req.body);
        res.status(201).json({
            message: "Interface created successfully.",
            data: networkInterface,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}
async function updateInterface(req, res) {
    try {
        const { id } = req.params;
        const networkInterface = await NetworkInterfaceService.updateInterface(id, req.body);
        res.json({
            message: "Interface updated successfully.",
            data: networkInterface,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}
async function deleteInterface(req, res) {
    try {
        const { id } = req.params;
        await NetworkInterfaceService.deleteInterface(id);
        res.json({
            message: "Interface deleted successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}
