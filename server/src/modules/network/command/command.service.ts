import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

class CommandService {

    async run(command: string) {

        console.log("");
        console.log("========== COMMAND ==========");
        console.log(command);

        try {

            const { stdout, stderr } =
                await execAsync(command);

            if (stderr && stderr.trim() !== "") {
                console.warn(stderr);
            }

            return stdout;

        } catch (err: any) {

            console.error(err.stderr);

            throw err;

        }

    }

    async exists(command: string) {

        try {

            await this.run(command);

            return true;

        } catch {

            return false;

        }

    }

    async output(command: string) {

        const stdout =
            await this.run(command);

        return stdout.trim();

    }

}

export const commandService =
    new CommandService();