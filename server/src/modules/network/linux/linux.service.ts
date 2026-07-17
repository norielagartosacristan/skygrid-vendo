import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

class LinuxService {

    async run(command: string) {

        console.log("");

        console.log("================================");

        console.log(command);

        console.log("================================");

        const { stdout, stderr } =
            await execAsync(command);

        if (stderr && stderr.trim() !== "") {

            throw new Error(stderr);

        }

        return stdout;

    }

}

export const linuxService =
    new LinuxService();