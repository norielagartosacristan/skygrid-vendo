"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voucherGenerator = void 0;
const crypto_1 = __importDefault(require("crypto"));
class VoucherGenerator {
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    // Tinanggal ang I, O, 0, 1 para hindi nakakalito
    randomPart(length) {
        let result = "";
        for (let i = 0; i < length; i++) {
            const index = crypto_1.default.randomInt(0, this.chars.length);
            result += this.chars[index];
        }
        return result;
    }
    generate() {
        return `${this.randomPart(4)}-${this.randomPart(4)}`;
    }
}
exports.voucherGenerator = new VoucherGenerator();
