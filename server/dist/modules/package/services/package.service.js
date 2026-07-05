"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class PackageService {
    async getAll() {
        return await prisma_1.default.package.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                price: "asc"
            }
        });
    }
}
exports.packageService = new PackageService();
