import os from "os";
import prisma from "../../../config/prisma";
import { vendorService } from "../../vendor/services/vendor.service";
import { fingerprintService } from "./fingerprint.service";
//import { machineStorageService } from "./machineStorage.service";

class MachineService {

    async register() {

        const fingerprint = fingerprintService.generate();
        console.log("Generated fingerprint:", fingerprint);

        const mac =
            Object.values(os.networkInterfaces())
                .flat()
                .find(i => i?.mac && i.mac !== "00:00:00:00:00:00")
                ?.mac ?? "";

        const ip =
            Object.values(os.networkInterfaces())
                .flat()
                .find(i => i?.family === "IPv4" && !i.internal)
                ?.address ?? "";

        // Hanapin muna gamit ang fingerprint
        let machine = await prisma.machine.findFirst({
            where: {
                fingerprint
            }
        });

        // Kung wala, hanapin gamit ang MAC address
        if (!machine) {

            machine = await prisma.machine.findFirst({
                where: {
                    macAddress: mac
                }
            });

        }

        // Kung wala pa rin, saka lang gumawa ng bagong machine
        if (!machine) {

            const vendor =
                await vendorService.getOrCreateDefaultVendor();

            machine = await prisma.machine.create({

                data: {

                    vendorId: vendor.id,

                    name: os.hostname(),

                    ipAddress: ip,

                    macAddress: mac,

                    fingerprint,

                    status: "ONLINE"

                }

            });

        }

        return machine;

    }


   async getCurrentMachine() {

    const fingerprint =
        fingerprintService.generate();

    return prisma.machine.findFirst({

        where: {

            fingerprint

        }

    });

}

}

export const machineService = new MachineService();