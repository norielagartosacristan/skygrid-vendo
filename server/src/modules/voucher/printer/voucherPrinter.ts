import fs from "fs";
import path from "path";
import QRCode from "qrcode";

export async function generateVoucherHTML(vouchers: any[]) {

    const template = fs.readFileSync(
        path.join(__dirname, "voucher.template.html"),
        "utf8"
    );

    const cardTemplate = fs.readFileSync(
        path.join(__dirname, "voucher.card.html"),
        "utf8"
    );

    const captivePortal =
        process.env.CAPTIVE_PORTAL_URL ??
        "http://10.0.0.1";

    let html = "";

    for (const voucher of vouchers) {

        const qrCode = await QRCode.toDataURL(
            `${captivePortal}/login?v=${voucher.code}`
        );

        html += cardTemplate
            .replace(/{{PACKAGE}}/g, voucher.package.name)
            .replace(/{{PRICE}}/g, Number(voucher.package.price).toFixed(2))
            .replace(
                /{{DURATION}}/g,
                `${voucher.package.duration} ${voucher.package.durationUnit}`
            )
            .replace(/{{CODE}}/g, voucher.code)
            .replace(/{{QRCODE}}/g, qrCode);

    }

    return template.replace("{{VOUCHERS}}", html);

}