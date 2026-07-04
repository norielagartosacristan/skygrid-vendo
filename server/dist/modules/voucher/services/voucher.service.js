"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voucherService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const voucher_generator_1 = require("../generators/voucher.generator");
class VoucherService {
    async generateUniqueCode() {
        while (true) {
            const code = voucher_generator_1.voucherGenerator.generate();
            const exists = await prisma_1.default.voucher.findUnique({
                where: {
                    code
                }
            });
            if (!exists) {
                return code;
            }
        }
    }
    async generate(packageId) {
        const pkg = await prisma_1.default.package.findUnique({
            where: {
                id: packageId
            }
        });
        if (!pkg) {
            throw new Error("Package not found");
        }
        const code = await this.generateUniqueCode();
        return await prisma_1.default.voucher.create({
            data: {
                code,
                packageId
            },
            include: {
                package: true
            }
        });
    }
    async redeem(code) {
        const voucher = await prisma_1.default.voucher.findUnique({
            where: {
                code
            },
            include: {
                package: true
            }
        });
        if (!voucher) {
            throw new Error("Voucher not found");
        }
        if (voucher.status !== "ACTIVE") {
            throw new Error("Voucher already used");
        }
        return voucher;
    }
}
exports.voucherService = new VoucherService();
