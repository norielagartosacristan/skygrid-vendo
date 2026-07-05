"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVoucherHTML = generateVoucherHTML;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const qrcode_1 = __importDefault(require("qrcode"));
async function generateVoucherHTML(vouchers) {
    const template = fs_1.default.readFileSync(path_1.default.join(__dirname, "voucher.template.html"), "utf8");
    const cardTemplate = fs_1.default.readFileSync(path_1.default.join(__dirname, "voucher.card.html"), "utf8");
    const captivePortal = process.env.CAPTIVE_PORTAL_URL ??
        "http://10.0.0.1";
    let html = "";
    for (const voucher of vouchers) {
        const qrCode = await qrcode_1.default.toDataURL(`${captivePortal}/login?v=${voucher.code}`);
        html += cardTemplate
            .replace(/{{PACKAGE}}/g, voucher.package.name)
            .replace(/{{PRICE}}/g, Number(voucher.package.price).toFixed(2))
            .replace(/{{DURATION}}/g, `${voucher.package.duration} ${voucher.package.durationUnit}`)
            .replace(/{{CODE}}/g, voucher.code)
            .replace(/{{QRCODE}}/g, qrCode);
    }
    return template.replace("{{VOUCHERS}}", html);
}
