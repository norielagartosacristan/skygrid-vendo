import crypto from "crypto";

export class VoucherGenerator {

    generate(): string {

        const part1 = crypto.randomInt(1000, 9999);
        const part2 = crypto.randomInt(1000, 9999);

        return `${part1}-${part2}`;

    }

}

export const voucherGenerator =
    new VoucherGenerator();