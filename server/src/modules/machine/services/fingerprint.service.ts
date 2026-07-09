import crypto from "crypto";
import os from "os";

class FingerprintService {

    generate() {

        const cpu = os.cpus()[0]?.model ?? "";

        const hostname = os.hostname();

        const macs = Object.values(os.networkInterfaces())
            .flat()
            .filter(
                (i) =>
                    i &&
                    !i.internal &&
                    i.mac &&
                    i.mac !== "00:00:00:00:00:00"
            )
            .map((i) => i!.mac)
            .sort()
            .join("|");

        return crypto
            .createHash("sha256")
            .update(cpu + hostname + macs)
            .digest("hex");

    }

}

export const fingerprintService =
    new FingerprintService();