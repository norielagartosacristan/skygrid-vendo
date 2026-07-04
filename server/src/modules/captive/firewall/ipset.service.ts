import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

class IPSetService {

    private async run(command: string) {

        const { stdout } = await execAsync(command);

        return stdout;

    }

    /**
     * Allow client
     */
    async allow(ip: string) {

        await this.run(
            `ipset add skygrid_clients ${ip} -exist`
        );

        console.log(`✅ Allowed ${ip}`);

    }

    /**
     * Block client
     */
    async block(ip: string) {

        try {

            await this.run(
                `ipset del skygrid_clients ${ip}`
            );

        } catch {

        }

        console.log(`❌ Blocked ${ip}`);

    }

    /**
     * Check if client exists
     */
    async exists(ip: string): Promise<boolean> {

        try {

            await this.run(
                `ipset test skygrid_clients ${ip}`
            );

            return true;

        } catch {

            return false;

        }

    }

    /**
     * List clients
     */
    async list() {

        return await this.run(
            "ipset list skygrid_clients"
        );

    }

    /**
     * Clear all clients
     */
    async clear() {

        await this.run(
            "ipset flush skygrid_clients"
        );

    }

}

export const ipsetService =
    new IPSetService();