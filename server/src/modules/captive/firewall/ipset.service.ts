import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Full path to ipset using sudo (NOPASSWD configured)
 */
const IPSET = "sudo /usr/sbin/ipset";

class IPSetService {

    /**
     * Execute shell command
     */
    private async run(command: string): Promise<string> {

        try {

            const { stdout } = await execAsync(command);

            return stdout;

        } catch (err: any) {

            throw new Error(
                err.stderr || err.message
            );

        }

    }

    /**
     * Allow client Internet access
     */
    async allow(ip: string): Promise<void> {

        await this.run(
            `${IPSET} add skygrid_clients ${ip} -exist`
        );

        console.log(`✅ Allowed Client: ${ip}`);

    }

    /**
     * Block client Internet access
     */
    async block(ip: string): Promise<void> {

        try {

            await this.run(
                `${IPSET} del skygrid_clients ${ip}`
            );

        } catch {
            // Ignore if IP is already removed
        }

        console.log(`❌ Blocked Client: ${ip}`);

    }

    /**
     * Check if client is already allowed
     */
    async exists(ip: string): Promise<boolean> {

        try {

            await this.run(
                `${IPSET} test skygrid_clients ${ip}`
            );

            return true;

        } catch {

            return false;

        }

    }

    /**
     * List all allowed clients
     */
    async list(): Promise<string> {

        return await this.run(
            `${IPSET} list skygrid_clients`
        );

    }

    /**
     * Remove all clients
     */
    async clear(): Promise<void> {

        await this.run(
            `${IPSET} flush skygrid_clients`
        );

        console.log("🧹 Cleared all captive clients");

    }

}

export const ipsetService = new IPSetService();