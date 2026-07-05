import os from "os";
import crypto from "crypto";

export function getMachineFingerprint() {

    const interfaces = os.networkInterfaces();

    let mac = "";

    for (const name of Object.keys(interfaces)) {

        const iface = interfaces[name];

        if (!iface) continue;

        for (const item of iface) {

            if (
                !item.internal &&
                item.mac &&
                item.mac !== "00:00:00:00:00:00"
            ) {

                mac = item.mac;
                break;

            }

        }

    }

    const hostname = os.hostname();

    return crypto
        .createHash("sha256")
        .update(`${hostname}-${mac}`)
        .digest("hex");

}