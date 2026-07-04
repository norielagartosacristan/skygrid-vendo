import prisma from "../../../config/prisma";
import { voucherGenerator } from "../generators/voucher.generator";

class VoucherService {

    private async generateUniqueCode(): Promise<string> {

        while (true) {

            const code = voucherGenerator.generate();

            const exists = await prisma.voucher.findUnique({
                where: {
                    code
                }
            });

            if (!exists) {
                return code;
            }

        }

    }

    async generate(packageId: string) {

        const pkg = await prisma.package.findUnique({

            where: {
                id: packageId
            }

        });

        if (!pkg) {

            throw new Error("Package not found");

        }

        const code = await this.generateUniqueCode();

        return await prisma.voucher.create({

            data: {

                code,

                packageId

            },

            include: {

                package: true

            }

        });

    }

    async redeem(code: string) {

        const voucher = await prisma.voucher.findUnique({

            where: {
                code
            },

            include: {
                package: true
            }

        });

        if (!voucher) {

            throw new Error("Voucher not found");

        }

        if (voucher.status !== "ACTIVE") {

            throw new Error("Voucher already used");

        }

        return voucher;

    }

}

export const voucherService = new VoucherService();