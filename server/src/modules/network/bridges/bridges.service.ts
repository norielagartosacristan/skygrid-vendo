import prisma from "../../../config/prisma";

class BridgeService {

    async list() {

        return prisma.bridge.findMany({

            include: {

                members: true

            }

        });

    }

    async create(data: any) {

        return prisma.bridge.create({

            data: {

                name: data.name,

                enabled: true

            }

        });

    }

    async remove(id: string) {

        return prisma.bridge.delete({

            where: {

                id

            }

        });

    }

}

export const bridgeService =
    new BridgeService();