"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMachineFingerprint = getMachineFingerprint;
const os_1 = __importDefault(require("os"));
const crypto_1 = __importDefault(require("crypto"));
function getMachineFingerprint() {
    const interfaces = os_1.default.networkInterfaces();
    let mac = "";
    for (const name of Object.keys(interfaces)) {
        const iface = interfaces[name];
        if (!iface)
            continue;
        for (const item of iface) {
            if (!item.internal &&
                item.mac &&
                item.mac !== "00:00:00:00:00:00") {
                mac = item.mac;
                break;
            }
        }
    }
    const hostname = os_1.default.hostname();
    return crypto_1.default
        .createHash("sha256")
        .update(`${hostname}-${mac}`)
        .digest("hex");
}
