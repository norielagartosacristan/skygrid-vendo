import prisma from "../../../config/prisma";

class PackageService {

    async getAll() {

        return await prisma.package.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                price: "asc"
            }

        });

    }

}

export const packageService = new PackageService();