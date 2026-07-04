import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

class FirewallRulesService {

    private async run(command: string) {

        console.log("[Firewall]", command);

        try {

            const { stdout, stderr } = await execAsync(command);

            if (stderr) {

                console.warn(stderr);

            }

            return stdout;

        } catch (err: any) {

            console.error(err.message);

            return "";

        }

    }

    /**
     * Initialize firewall
     */
    async initialize() {

        console.log("Initializing SkyGrid Firewall...");

        await this.enableIpForward();

        await this.createIPSet();

        await this.allowEstablishedConnections();

        console.log("Firewall initialized.");

    }

    /**
     * Enable IPv4 Forwarding
     */
    private async enableIpForward() {

        await this.run(
            "sysctl -w net.ipv4.ip_forward=1"
        );

    }

    /**
     * Create ipset
     */
    private async createIPSet() {

        await this.run(
            "ipset create skygrid_clients hash:ip -exist"
        );

    }

    /**
     * Allow ESTABLISHED connections
     */
    private async allowEstablishedConnections() {

        await this.run(
            "iptables -C FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT || iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT"
        );

    }

    /**
     * Add WAN Masquerade
     */
    async configureWAN(wan: string) {

        await this.run(
            `iptables -t nat -C POSTROUTING -o ${wan} -j MASQUERADE || iptables -t nat -A POSTROUTING -o ${wan} -j MASQUERADE`
        );

    }

    /**
     * Register VLAN
     */
    async registerVLAN(
        vlanInterface: string,
        gateway: string
    ) {

        console.log(
            `Registering ${vlanInterface}`
        );

        // Allow access to gateway (portal/API)
        await this.run(
            `iptables -C INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT || iptables -A INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`
        );

        // Allow clients that are in ipset
        await this.run(
            `iptables -C FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT || iptables -A FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`
        );

        // Block all remaining traffic
        await this.run(
            `iptables -C FORWARD -i ${vlanInterface} -j DROP || iptables -A FORWARD -i ${vlanInterface} -j DROP`
        );

    }

    /**
     * Remove VLAN
     */
    async unregisterVLAN(
        vlanInterface: string,
        gateway: string
    ) {

        await this.run(
            `iptables -D INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`
        );

        await this.run(
            `iptables -D FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`
        );

        await this.run(
            `iptables -D FORWARD -i ${vlanInterface} -j DROP`
        );

    }

    /**
     * Show Rules
     */
    async showRules() {

        return await this.run(
            "iptables -L -n -v"
        );

    }

}

export const firewallRules =
    new FirewallRulesService();