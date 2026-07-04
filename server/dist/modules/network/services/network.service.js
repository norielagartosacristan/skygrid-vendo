"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVlans = getVlans;
exports.createVlan = createVlan;
const prisma_1 = __importDefault(require("../../../config/prisma"));
async function getVlans() {
    return prisma_1.default.networkVlan.findMany({
        orderBy: {
            vlanId: "asc"
        }
    });
}
async function createVlan(data) {
    return prisma_1.default.networkVlan.create({
        data
    });
}
