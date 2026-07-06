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
            console.error("[Firewall]", err.stderr || err.message);
            return "";
        }
    }

    /**
     * Initialize firewall
     */
    async initialize(): Promise<void> {
        console.log("🔥 Initializing SkyGrid Firewall...");

        await this.enableIpForward();
        await this.createIPSet();
        await this.allowEstablishedConnections();

        console.log("✅ Firewall initialized.");
    }

    /**
     * Enable IPv4 Forwarding
     */
    private async enableIpForward(): Promise<void> {
        await this.run(
            `${SYSCTL} -w net.ipv4.ip_forward=1`
        );
    }

    /**
     * Create IPSET
     */
    private async createIPSet(): Promise<void> {
        await this.run(
            `${IPSET} create skygrid_clients hash:ip -exist`
        );
    }

    /**
     * Allow established connections
     */
    private async allowEstablishedConnections(): Promise<void> {
        await this.run(
            `${IPTABLES} -C FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT || ${IPTABLES} -I FORWARD 1 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT`
        );
    }

    /**
     * Configure WAN masquerade
     */
    async configureWAN(wan: string): Promise<void> {
        await this.run(
            `${IPTABLES} -t nat -C POSTROUTING -o ${wan} -j MASQUERADE || ${IPTABLES} -t nat -A POSTROUTING -o ${wan} -j MASQUERADE`
        );
    }

    /**
     * Register Captive VLAN
     */
    async registerVLAN(vlanInterface: string, gateway: string): Promise<void> {

        console.log(`📡 Registering ${vlanInterface}`);

        //
        // Remove old rules first
        //

        await this.unregisterVLAN(vlanInterface, gateway);

        //
        // Allow portal access
        //

        await this.run(
            `${IPTABLES} -C INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT || ${IPTABLES} -A INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`
        );

        //
        // Allow authenticated clients
        //

        await this.run(
            `${IPTABLES} -I FORWARD 2 -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`
        );

        //
        // Block everyone else
        //

        await this.run(
            `${IPTABLES} -A FORWARD -i ${vlanInterface} -j DROP`
        );

        console.log(`✅ ${vlanInterface} registered.`);
    }

    /**
     * Remove VLAN rules
     */
    async unregisterVLAN(
        vlanInterface: string,
        gateway: string
    ): Promise<void> {

        while (true) {
            const result = await this.run(
                `${IPTABLES} -D INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`
            );

            if (!result) break;
        }

        while (true) {
            const result = await this.run(
                `${IPTABLES} -D FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`
            );

            if (!result) break;
        }

        while (true) {
            const result = await this.run(
                `${IPTABLES} -D FORWARD -i ${vlanInterface} -j DROP`
            );

            if (!result) break;
        }
    }

    /**
     * Show firewall rules
     */
    async showRules(): Promise<string> {
        return this.run(
            `${IPTABLES} -L -n -v --line-numbers`
        );
    }
}

export const firewallRules = new FirewallRulesService();