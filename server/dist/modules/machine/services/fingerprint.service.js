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
        const cpus = os_1.default.cpus()[0].model;
        const hostname = os_1.default.hostname();
        const interfaces = JSON.stringify(os_1.default.networkInterfaces());
        return crypto_1.default
            .createHash("sha256")
            .update(cpus + hostname + interfaces)
            .digest("hex");
    }
}
exports.fingerprintService = new FingerprintService();
