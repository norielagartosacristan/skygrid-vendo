import prisma from "../../../config/prisma";

export async function getVlans() {

    return prisma.networkVlan.findMany({

        orderBy: {
            vlanId: "asc"
        }

    });

}

export async function createVlan(data: any) {

    return prisma.networkVlan.create({

        data

    });

}
