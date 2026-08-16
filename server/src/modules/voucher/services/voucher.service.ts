import prisma from "../../../config/prisma";
import { voucherGenerator } from "../generators/voucher.generator";

type VoucherValidityUnit =
    | "DAY"
    | "MONTH"
    | "YEAR";

class VoucherService {

    private async generateUniqueCode(): Promise<string> {

        while (true) {

            const code =
                voucherGenerator.generate();

            const exists =
                await prisma.voucher.findUnique({
                    where: {
                        code
                    }
                });

            if (!exists) {
                return code;
            }
        }
    }


    /**
     * Generate voucher
     *
     * validityValue / validityUnit:
     *
     * null / null
     *     = regular one-time voucher
     *
     * 7 / DAY
     *     = 7-day one-device voucher
     *
     * 6 / MONTH
     *     = 6-month one-device voucher
     */
    async generate(
        packageId: string,
        validityValue: number | null = null,
        validityUnit: VoucherValidityUnit | null = null
    ) {

        const pkg =
            await prisma.package.findUnique({
                where: {
                    id: packageId
                }
            });

        if (!pkg) {

            throw new Error(
                "Package not found"
            );

        }


        // ==========================================
        // VALIDATE LONG-TERM VALIDITY
        // ==========================================

        if (validityValue !== null) {

            if (
                !Number.isInteger(validityValue) ||
                validityValue <= 0
            ) {

                throw new Error(
                    "Invalid voucher validity."
                );

            }

            if (!validityUnit) {

                throw new Error(
                    "Voucher validity unit is required."
                );

            }

            if (
                ![
                    "DAY",
                    "MONTH",
                    "YEAR"
                ].includes(validityUnit)
            ) {

                throw new Error(
                    "Invalid voucher validity unit."
                );

            }
        }


        const code =
            await this.generateUniqueCode();


        return await prisma.voucher.create({

            data: {

                code,

                packageId,

                validityValue,

                validityUnit,

                boundClientMac:
                    null,

                activatedAt:
                    null,

                expiresAt:
                    null

            },

            include: {

                package: true

            }

        });

    }


    /**
     * Redeem voucher.
     *
     * Regular voucher:
     * - one time only
     *
     * Long-term voucher:
     * - first device gets bound
     * - validity starts on first use
     * - same device can reuse
     * - different device is rejected
     */
    async redeem(
        code: string,
        clientMac: string
    ) {

        const voucher =
            await prisma.voucher.findUnique({

                where: {
                    code
                },

                include: {
                    package: true
                }

            });


        if (!voucher) {

            throw new Error(
                "Voucher not found."
            );

        }


        // ==========================================
        // REGULAR VOUCHER
        // ==========================================

        const isLongTerm =
            voucher.validityValue !== null &&
            voucher.validityUnit !== null;


        if (!isLongTerm) {

            if (
                voucher.status !== "ACTIVE"
            ) {

                throw new Error(
                    "Voucher already used."
                );

            }

            return voucher;
        }


        // ==========================================
        // LONG-TERM VOUCHER
        // ==========================================

        const now =
            new Date();


        // ------------------------------------------
        // EXPIRED
        // ------------------------------------------

        if (
            voucher.expiresAt &&
            voucher.expiresAt <= now
        ) {

            if (
                voucher.status !== "EXPIRED"
            ) {

                await prisma.voucher.update({

                    where: {
                        id: voucher.id
                    },

                    data: {
                        status: "EXPIRED"
                    }

                });

            }

            throw new Error(
                "Voucher has expired."
            );

        }


        // ------------------------------------------
        // FIRST USE
        // ------------------------------------------

        if (!voucher.boundClientMac) {

            const activatedAt =
                now;

            const expiresAt =
                new Date(now);


            switch (
                voucher.validityUnit
            ) {

                case "DAY":

                    expiresAt.setDate(
                        expiresAt.getDate() +
                        voucher.validityValue!
                    );

                    break;


                case "MONTH":

                    expiresAt.setMonth(
                        expiresAt.getMonth() +
                        voucher.validityValue!
                    );

                    break;


                case "YEAR":

                    expiresAt.setFullYear(
                        expiresAt.getFullYear() +
                        voucher.validityValue!
                    );

                    break;


                default:

                    throw new Error(
                        "Invalid voucher validity unit."
                    );

            }


            return await prisma.voucher.update({

                where: {
                    id: voucher.id
                },

                data: {

                    boundClientMac:
                        clientMac,

                    activatedAt,

                    expiresAt,

                    status: "ACTIVE"

                },

                include: {

                    package: true

                }

            });

        }


        // ------------------------------------------
        // SAME DEVICE
        // ------------------------------------------

        if (
            voucher.boundClientMac ===
            clientMac
        ) {

            return voucher;

        }


        // ------------------------------------------
        // DIFFERENT DEVICE
        // ------------------------------------------

        throw new Error(
            "This voucher is already bound to another device."
        );

    }


    async getAll() {

        return await prisma.voucher.findMany({

            include: {

                package: true,

                session: true

            },

            orderBy: {

                createdAt: "desc"

            }

        });

    }

}


export const voucherService =
    new VoucherService();