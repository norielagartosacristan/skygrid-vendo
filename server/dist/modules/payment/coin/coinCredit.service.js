"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinCreditService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class CoinCreditService {
    async addCredit(clientMac, clientIP, amount) {
        const credit = await prisma_1.default.coinCredit.upsert({
            where: {
                clientMac
            },
            update: {
                credit: {
                    increment: amount
                },
                clientIP
            },
            create: {
                clientMac,
                clientIP,
                credit: amount
            }
        });
        return credit;
    }
}
exports.coinCreditService = new CoinCreditService();
