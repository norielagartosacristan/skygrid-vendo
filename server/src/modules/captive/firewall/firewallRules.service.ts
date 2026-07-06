import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

const IPTABLES = "sudo /usr/sbin/iptables";
const IPSET = "sudo /usr/sbin/ipset";
const SYSCTL = "sudo /usr/sbin/sysctl";

class FirewallRulesService {

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

            return "";

        }

    }

    /**
     * Initialize firewall
     */
    async initialize() {

        console.log("🔥 Initializing SkyGrid Firewall...");

        await this.enableIpForward();

        await this.createIPSet();

        await this.allowEstablishedConnections();

        console.log("✅ Firewall initialized.");

    }

    /**
     * Enable IPv4 Forwarding
     */
    private async enableIpForward() {

        await this.run(
            `${SYSCTL} -w net.ipv4.ip_forward=1`
        );

    }

    /**
     * Create SkyGrid IPSet
     */
    private async createIPSet() {

        await this.run(
            `${IPSET} create skygrid_clients hash:ip -exist`
        );

    }

    /**
     * Allow RELATED / ESTABLISHED connections
     */
    private async allowEstablishedConnections() {

        await this.run(
            `${IPTABLES} -C FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT || ${IPTABLES} -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT`
        );

    }

    /**
     * Configure WAN Masquerade
     */
    async configureWAN(wan: string) {

        await this.run(
            `${IPTABLES} -t nat -C POSTROUTING -o ${wan} -j MASQUERADE || ${IPTABLES} -t nat -A POSTROUTING -o ${wan} -j MASQUERADE`
        );

    }

    /**
     * Register Captive VLAN
     */
    async registerVLAN(vlanInterface: string, gateway: string) {

    console.log(`📡 Registering VLAN ${vlanInterface}`);

    // 1. Allow gateway access
    await this.run(
        `${IPTABLES} -C INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT || ${IPTABLES} -A INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`
    );

    // 2. Allow ESTABLISHED first (IMPORTANT)
    await this.run(
        `${IPTABLES} -C FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT || ${IPTABLES} -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT`
    );

    // 3. Allow authenticated users
    await this.run(
        `${IPTABLES} -C FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT || ${IPTABLES} -A FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`
    );

    // 4. DROP LAST (IMPORTANT ORDER)
    await this.run(
        `${IPTABLES} -C FORWARD -i ${vlanInterface} -j DROP || ${IPTABLES} -A FORWARD -i ${vlanInterface} -j DROP`
    );

    console.log(`✅ ${vlanInterface} registered.`);
}
    /**
     * Remove VLAN Rules
     */
    async unregisterVLAN(
        vlanInterface: string,
        gateway: string
    ) {

        await this.run(
            `${IPTABLES} -D INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`
        );

        await this.run(
            `${IPTABLES} -D FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`
        );

        await this.run(
            `${IPTABLES} -D FORWARD -i ${vlanInterface} -j DROP`
        );

        console.log(`🗑 ${vlanInterface} unregistered.`);

    }

    /**
     * Show Firewall Rules
     */
    async showRules() {

        return await this.run(
            `${IPTABLES} -L -n -v`
        );

    }

}

export const firewallRules = new FirewallRulesService();