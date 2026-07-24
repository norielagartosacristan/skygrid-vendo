import os from "os";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const MACHINE_ID_FILE = path.join(
    process.cwd(),
    ".bayanet-machine-id"
);

function generateMachineId(): string {

    const randomPart =
        crypto
            .randomBytes(4)
            .toString("hex")
            .toUpperCase();

    return `BN-M-${randomPart}`;
}


function getMachineId(): string {

    /**
     * Check kung existing na ang Machine ID
     *
     * Importante ito dahil dapat hindi
     * nagbabago ang Machine ID kapag
     * ni-restart ang computer.
     */
    if (
        fs.existsSync(
            MACHINE_ID_FILE
        )
    ) {

        const machineId =
            fs
                .readFileSync(
                    MACHINE_ID_FILE,
                    "utf8"
                )
                .trim();

        if (machineId) {

            return machineId;

        }

    }


    /**
     * Generate new Machine ID
     */
    const machineId =
        generateMachineId();


    /**
     * Save sa local machine
     */
    fs.writeFileSync(

        MACHINE_ID_FILE,

        machineId,

        "utf8"

    );


    return machineId;

}


function getMacAddress(): string | null {

    const interfaces =
        os.networkInterfaces();


    for (
        const interfaceName
        of Object.keys(interfaces)
    ) {

        const addresses =
            interfaces[
                interfaceName
            ];


        if (!addresses) {

            continue;

        }


        for (
            const address
            of addresses
        ) {

            /**
             * Ignore internal loopback
             *
             * Example:
             * 127.0.0.1
             */
            if (
                address.internal
            ) {

                continue;

            }


            if (
                address.mac &&
                address.mac !==
                    "00:00:00:00:00:00"
            ) {

                return address.mac;

            }

        }

    }


    return null;

}


export function getMachineIdentity() {

    return {

        machineId:
            getMachineId(),

        platform:
            process.platform,

        architecture:
            process.arch,

        hostname:
            os.hostname(),

        macAddress:
            getMacAddress(),

        firmwareVersion:
            process.env.APP_VERSION ||
            "2.0.0"

    };

}