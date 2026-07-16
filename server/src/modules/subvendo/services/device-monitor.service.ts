import prisma from "../../../config/prisma";

export function startDeviceMonitor() {

    setInterval(async () => {

        const timeout = new Date(Date.now() - 60000);

        await prisma.subVendo.updateMany({
            where: {
                online: true,
                lastSeen: {
                    lt: timeout
                }
            },
            data: {
                online: false
            }
        });

    }, 30000);

}