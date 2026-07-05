import prisma from "../../../config/prisma";

class VendorService {

    async getOrCreateDefaultVendor() {

        let vendor = await prisma.vendor.findFirst();

        if (vendor) {
            return vendor;
        }

        vendor = await prisma.vendor.create({
            data: {
                name: "SkyGrid Default"
            }
        });

        return vendor;
    }

}

export const vendorService = new VendorService();