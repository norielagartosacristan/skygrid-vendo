import crypto from "crypto";

class VoucherGenerator {

    private readonly chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    // Tinanggal ang I, O, 0, 1 para hindi nakakalito

    private randomPart(length: number): string {

        let result = "";

        for (let i = 0; i < length; i++) {

            const index = crypto.randomInt(0, this.chars.length);

            result += this.chars[index];

        }

        return result;

    }

    generate(): string {

        return `${this.randomPart(4)}-${this.randomPart(4)}`;

    }

}

export const voucherGenerator = new VoucherGenerator();