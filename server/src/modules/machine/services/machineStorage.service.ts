import fs from "fs";
import path from "path";

const CONFIG_DIR = "/etc/skygrid";
const CONFIG_FILE = path.join(CONFIG_DIR, "machine.json");

class MachineStorageService {

    ensure() {

        if (!fs.existsSync(CONFIG_DIR)) {
            fs.mkdirSync(CONFIG_DIR, { recursive: true });
        }

        if (!fs.existsSync(CONFIG_FILE)) {

            fs.writeFileSync(
                CONFIG_FILE,
                JSON.stringify({}, null, 2)
            );

        }

    }

    load() {

        this.ensure();

        return JSON.parse(
            fs.readFileSync(CONFIG_FILE, "utf8")
        );

    }

    save(data: any) {

        this.ensure();

        fs.writeFileSync(
            CONFIG_FILE,
            JSON.stringify(data, null, 2)
        );

    }

}

export const machineStorageService =
    new MachineStorageService();