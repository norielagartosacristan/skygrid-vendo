"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fingerprintService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const os_1 = __importDefault(require("os"));
class FingerprintService {
    generate() {
        const cpu = os_1.default.cpus()[0]?.model ?? "";
        const hostname = os_1.default.hostname();
        const macs = Object.values(os_1.default.networkInterfaces())
            .flat()
            .filter((i) => i &&
            !i.internal &&
            i.mac &&
            i.mac !== "00:00:00:00:00:00")
            .map((i) => i.mac)
            .sort()
            .join("|");
        return crypto_1.default
            .createHash("sha256")
            .update(cpu + hostname + macs)
            .digest("hex");
    }
}
exports.fingerprintService = new FingerprintService();
