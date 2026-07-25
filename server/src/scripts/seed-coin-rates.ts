import prisma from "../config/prisma";

async function main() {

    const rates = [
        {
            amount: 1,
            duration: 15,
            durationUnit: "MINUTE" as const,
        },
        {
            amount: 5,
            duration: 60,
            durationUnit: "MINUTE" as const,
        },
        {
            amount: 10,
            duration: 225,
            durationUnit: "MINUTE" as const,
        },
        {
            amount: 20,
            duration: 480,
            durationUnit: "MINUTE" as const,
        },
    ];

    for (const rate of rates) {

        await prisma.coinRate.upsert({

            where: {
                amount: rate.amount,
            },

            update: {

                duration:
                    rate.duration,

                durationUnit:
                    rate.durationUnit,

                enabled:
                    true,

            },

            create: {

                amount:
                    rate.amount,

                duration:
                    rate.duration,

                durationUnit:
                    rate.durationUnit,

                enabled:
                    true,

            },

        });

        console.log(
            `✅ ₱${rate.amount} = ${rate.duration} ${rate.durationUnit}`
        );

    }

}

main()
    .catch((error) => {

        console.error(error);

        process.exit(1);

    })
    .finally(async () => {

        await prisma.$disconnect();

    });
