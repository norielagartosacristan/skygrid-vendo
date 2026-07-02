"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterfaces = getInterfaces;
exports.getInterface = getInterface;
exports.createInterface = createInterface;
exports.updateInterface = updateInterface;
exports.deleteInterface = deleteInterface;
const prisma_1 = __importDefault(require("../config/prisma"));
async function getInterfaces() {
    return prisma_1.default.networkInterface.findMany({
        orderBy: {
            createdAt: "asc",
        },
    });
}
async function getInterface(id) {
    return prisma_1.default.networkInterface.findUnique({
        where: { id },
    });
}
async function createInterface(data) {
    return prisma_1.default.networkInterface.create({
        data,
    });
}
async function updateInterface(id, data) {
    return prisma_1.default.networkInterface.update({
        where: {
            id,
        },
        data,
    });
}
async function deleteInterface(id) {
    return prisma_1.default.networkInterface.delete({
        where: {
            id,
        },
    });
}
