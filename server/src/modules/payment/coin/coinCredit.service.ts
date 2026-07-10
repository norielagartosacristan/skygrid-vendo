import prisma from "../../../config/prisma";

class CoinCreditService {

    async addCredit(
        clientMac: string,
        clientIP: string,
        amount: number
    ) {

        const credit =
            await prisma.coinCredit.upsert({

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

export const coinCreditService =
    new CoinCreditService();