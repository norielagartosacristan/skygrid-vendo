import os from "os";
import prisma from "../../../config/prisma";
import { vendorService } from "../../vendor/services/vendor.service";
import { fingerprintService } from "./fingerprint.service";
import { machineStorageService } from "./machineStorage.service";

class MachineService {

    async register() {

        const fingerprint =
            fingerprintService.generate();

        let machine =
            await prisma.machine.findFirst({
                where: {
                    fingerprint
                }
            });

        if (!machine) {

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

           const vendor =
    await vendorService.getOrCreateDefaultVendor();

machine =
    await prisma.machine.create({

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

        machineStorageService.save({

            machineId: machine.id,

            fingerprint

        });

        return machine;

    }

    getMachineId() {

        const data =
            machineStorageService.load();

        return data.machineId;

    }

    async getCurrentMachine() {

        return prisma.machine.findUnique({

            where: {

                id: this.getMachineId()

            }

        });

    }

}

export const machineService =
    new MachineService();