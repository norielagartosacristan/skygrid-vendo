import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

const IPTABLES = "sudo /usr/sbin/iptables";

class FirewallService {

    /**
     * Execute shell command
     */
    private async run(command: string): Promise<string> {

        console.log("[Firewall]", command);

        try {

            const { stdout, stderr } = await execAsync(command);

            if (stderr) {
                console.warn(stderr);
            }

            return stdout;

        } catch (err: any) {

            console.error("[Firewall Error]");
            console.error(err.stderr || err.message);

            throw err;

        }

    }

    /**
     * Allow a client Internet access
     */
    async allowClient(ip: string): Promise<void> {

        await this.run(
            `${IPTABLES} -I FORWARD -s ${ip} -j ACCEPT`
        );

        console.log(`✅ Client Allowed: ${ip}`);

    }

    /**
     * Block a client Internet access
     */
    async blockClient(ip: string): Promise<void> {

        try {

            await this.run(
                `${IPTABLES} -D FORWARD -s ${ip} -j ACCEPT`
            );

        } catch {

            // Ignore if rule doesn't exist

        }

        console.log(`❌ Client Blocked: ${ip}`);

    }

    /**
     * Enable captive portal (block all unauthenticated traffic)
     */
    async enableCaptivePortal(
        vlan: string = "enp2s0.22"
    ): Promise<void> {

        await this.run(
            `${IPTABLES} -C FORWARD -i ${vlan} -j DROP || ${IPTABLES} -A FORWARD -i ${vlan} -j DROP`
        );

        console.log("🔒 Captive Portal Enabled");

    }

    /**
     * Disable captive portal
     */
    async disableCaptivePortal(
        vlan: string = "enp2s0.22"
    ): Promise<void> {

        try {

            await this.run(
                `${IPTABLES} -D FORWARD -i ${vlan} -j DROP`
            );

        } catch {

            // Ignore if the rule doesn't exist

        }

        console.log("🔓 Captive Portal Disabled");

    }

    /**
     * List FORWARD rules
     */
    async listRules(): Promise<string> {

        return await this.run(
            `${IPTABLES} -L FORWARD -n --line-numbers`
        );

    }

    /**
     * Flush FORWARD chain
     */
    async flushForward(): Promise<void> {

        await this.run(
            `${IPTABLES} -F FORWARD`
        );

        console.log("🧹 FORWARD chain cleared");

    }

}

export const firewallService = new FirewallService();