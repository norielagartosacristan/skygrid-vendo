"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voucherGenerator = exports.VoucherGenerator = void 0;
const crypto_1 = __importDefault(require("crypto"));
class VoucherGenerator {
    generate() {
        const part1 = crypto_1.default.randomInt(1000, 9999);
        const part2 = crypto_1.default.randomInt(1000, 9999);
        return `${part1}-${part2}`;
    }
}
exports.VoucherGenerator = VoucherGenerator;
exports.voucherGenerator = new VoucherGenerator();
