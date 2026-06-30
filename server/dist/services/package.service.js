"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackages = getPackages;
const prisma_1 = __importDefault(require("../config/prisma"));
async function getPackages() {
    return prisma_1.default.package.findMany({
        orderBy: {
            price: "asc",
        },
    });
}
