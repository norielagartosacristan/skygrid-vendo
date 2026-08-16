import os from "os";
import prisma from "../../../config/prisma";
import { vendorService } from "../../vendor/services/vendor.service";
import { fingerprintService } from "./fingerprint.service";
import {
    getMachineIdentity
} from "../machine.identity";
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

    const identity =
        getMachineIdentity();

    machine =
        await prisma.machine.create({

            data: {

                machineId:
                    identity.machineId,

                vendorId:
                    vendor.id,

                name:
                    os.hostname(),

                ipAddress:
                    ip,

                macAddress:
                    mac,

                fingerprint,

                status:
                    "ONLINE"

            }

        });

}

        return machine;

    }


  async getCurrentMachine() {

    const fingerprint =
        fingerprintService.generate();

    console.log(
        "🔍 Current Machine Fingerprint:",
        fingerprint
    );

    /**
     * ========================================
     * 1. FIND BY FINGERPRINT
     * ========================================
     */

    let machine =
        await prisma.machine.findFirst({

            where: {

                fingerprint

            }

        });

    if (machine) {

        console.log(
            "✅ Machine found by fingerprint:",
            machine.id
        );

        return machine;

    }


    /**
     * ========================================
     * 2. FIND BY PHYSICAL MAC
     * ========================================
     */

    const mac =
        Object.values(
            os.networkInterfaces()
        )
        .flat()
        .find(
            i =>
                i &&
                !i.internal &&
                i.mac &&
                i.mac !==
                    "00:00:00:00:00:00"
        )
        ?.mac ?? "";


    console.log(
        "🔍 Current Machine MAC:",
        mac
    );


    if (mac) {

        machine =
            await prisma.machine.findFirst({

                where: {

                    macAddress:
                        mac

                }

            });

    }


    if (machine) {

        console.log(
            "✅ Machine found by MAC:",
            machine.id
        );

        return machine;

    }


    /**
     * ========================================
     * 3. NOT FOUND
     * ========================================
     */

    console.error(
        "❌ Current machine not found."
    );

    console.error(
        "Fingerprint:",
        fingerprint
    );

    console.error(
        "MAC:",
        mac
    );

    return null;

}

async repairSubVendo(machineId: string) {

    console.log(
        `🔧 Checking SubVendo bindings for Machine ${machineId}`
    );

    const result =
        await prisma.subVendo.updateMany({

            where: {

                status: "CONFIGURED",

                enabled: true,

                OR: [
                    {
                        machineId: null
                    },
                    {
                        machineId: machineId
                    }
                ]

            },

            data: {
                machineId
            }

        });

    console.log(
        `✅ ${result.count} SubVendo(s) bound to Machine ${machineId}`
    );

    return result;
}
}

export const machineService = new MachineService();