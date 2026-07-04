import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

class FirewallService {

    /**
     * Execute shell command
     */
    private async run(command: string) {

        console.log("[Firewall]", command);

        const { stdout, stderr } = await execAsync(command);

        if (stderr) {

            console.warn(stderr);

        }

        return stdout;

    }

    /**
     * Allow client internet access
     */
    async allowClient(ip: string) {

        await this.run(
            `sudo iptables -I FORWARD -s ${ip} -j ACCEPT`
        );

        console.log(`✅ Client Allowed: ${ip}`);

    }

    /**
     * Block client internet access
     */
    async blockClient(ip: string) {

        try {

            await this.run(
                `sudo iptables -D FORWARD -s ${ip} -j ACCEPT`
            );

        } catch {

            // Ignore if rule doesn't exist

        }

        console.log(`❌ Client Blocked: ${ip}`);

    }

    /**
     * Block all VLAN traffic to Internet
     */
    async enableCaptivePortal(vlan: string = "enp2s0.22") {

        await this.run(
            `sudo iptables -C FORWARD -i ${vlan} -j DROP || sudo iptables -A FORWARD -i ${vlan} -j DROP`
        );

        console.log("🔒 Captive Portal Enabled");

    }

    /**
     * Disable captive portal
     */
    async disableCaptivePortal(vlan: string = "enp2s0.22") {

        try {

            await this.run(
                `sudo iptables -D FORWARD -i ${vlan} -j DROP`
            );

        } catch {

            // Ignore

        }

        console.log("🔓 Captive Portal Disabled");

    }

    /**
     * Show all FORWARD rules
     */
    async listRules() {

        return await this.run(
            "sudo iptables -L FORWARD -n --line-numbers"
        );

    }

    /**
     * Flush FORWARD chain
     */
    async flushForward() {

        await this.run(
            "sudo iptables -F FORWARD"
        );

        console.log("🗑 FORWARD chain cleared");

    }

}

export const firewallService = new FirewallService();