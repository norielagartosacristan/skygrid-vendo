"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.saveSettings = saveSettings;
const prisma_1 = __importDefault(require("../config/prisma"));
async function getSettings() {
    return prisma_1.default.globalBandwidth.findFirst();
}
async function saveSettings(data) {
    const existing = await prisma_1.default.globalBandwidth.findFirst();
    if (existing) {
        return prisma_1.default.globalBandwidth.update({
            where: {
                id: existing.id,
            },
            data,
        });
    }
    return prisma_1.default.globalBandwidth.create({
        data,
    });
}
