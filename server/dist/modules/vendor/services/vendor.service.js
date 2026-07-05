"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class VendorService {
    async getOrCreateDefaultVendor() {
        let vendor = await prisma_1.default.vendor.findFirst();
        if (vendor) {
            return vendor;
        }
        vendor = await prisma_1.default.vendor.create({
            data: {
                name: "SkyGrid Default"
            }
        });
        return vendor;
    }
}
exports.vendorService = new VendorService();
