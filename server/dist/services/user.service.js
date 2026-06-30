"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const prisma_1 = __importDefault(require("../config/prisma"));
const hash_1 = require("../utils/hash");
async function getUsers() {
    return prisma_1.default.user.findMany({
        include: {
            vendor: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function getUserById(id) {
    return prisma_1.default.user.findUnique({
        where: { id },
        include: {
            vendor: true,
        },
    });
}
async function createUser(data) {
    const existing = await prisma_1.default.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (existing) {
        throw new Error("Email already exists.");
    }
    const hashedPassword = await (0, hash_1.hashPassword)(data.password);
    return prisma_1.default.user.create({
        data: {
            fullName: data.fullName,
            email: data.email,
            password: hashedPassword,
            role: data.role,
            vendorId: data.vendorId,
        },
    });
}
async function updateUser(id, data) {
    return prisma_1.default.user.update({
        where: { id },
        data,
    });
}
async function deleteUser(id) {
    return prisma_1.default.user.delete({
        where: { id },
    });
}
