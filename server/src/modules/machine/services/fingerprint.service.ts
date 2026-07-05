import crypto from "crypto";
import os from "os";

class FingerprintService {

    generate() {

        const cpus = os.cpus()[0].model;

        const hostname = os.hostname();

        const interfaces =
            JSON.stringify(os.networkInterfaces());

        return crypto
            .createHash("sha256")
            .update(cpus + hostname + interfaces)
            .digest("hex");

    }

}

export const fingerprintService =
    new FingerprintService();