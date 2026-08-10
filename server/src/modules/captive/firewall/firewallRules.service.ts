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
   private async run(
    command: string,
    ignoreError = false
): Promise<string> {

    console.log("[Firewall]", command);

    try {

        const { stdout, stderr } =
            await execAsync(command);

        if (stderr) {

            console.warn(
                "[Firewall stderr]",
                stderr
            );

        }

        return stdout;

    } catch (err: any) {

        console.error(
            "[Firewall ERROR]",
            command
        );

        console.error(
            err.stderr || err.message
        );

        if (ignoreError) {
            return "";
        }

        throw err;
    }
}

private async ruleExists(command: string): Promise<boolean> {
    try {
        await this.run(command);
        return true;
    } catch {
        return false;
    }
}
    /**
     * Initialize firewall
     */
   async initialize() {

    console.log("🔥 Initializing firewall...");

    try {

        await this.enableIpForward();

        await this.createIPSet();

        await this.allowEstablishedConnections();

        console.log(
            "✅ IPv4 forwarding enabled"
        );

        console.log(
            "✅ ipset skygrid_clients ready"
        );

        console.log(
            "✅ Firewall initialized"
        );

    } catch (error) {

        console.error(
            "❌ Firewall initialization failed:",
            error
        );

        throw error;

    }
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
        `${IPTABLES} -C FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT || ${IPTABLES} -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT`
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

        // 1. Linisin muna ang mga lumang rules para walang magka-conflict
        await this.unregisterVLAN(vlanInterface, gateway);

        // 2. Payagan ang portal access (Web and DNS Server ng local Ubuntu Machine)
        await this.run(
            `${IPTABLES} -A INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`
        );

        // ==========================================
        // DITO ANG MAGIC PARA SA AUTOMATIC REDIRECT
        // ==========================================

        // 3. KUNG naka-login na (nasa skygrid_clients), LAMPAS diretso sa internet (Bypass NAT Redirect)
        await this.run(
            `${IPTABLES} -t nat -A PREROUTING -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`
        );

        // 4. I-intercept at i-force redirect ang DNS requests (Port 53) sa server mo (Kailangan para sa portal detection ng phones)
        await this.run(
            `${IPTABLES} -t nat -A PREROUTING -i ${vlanInterface} -p udp --dport 53 -j DNAT --to-destination ${gateway}:53`
        );
        await this.run(
            `${IPTABLES} -t nat -A PREROUTING -i ${vlanInterface} -p tcp --dport 53 -j DNAT --to-destination ${gateway}:53`
        );

        // 5. I-redirect ang lahat ng HTTP (Port 80) traffic papunta sa portal screen mo (Port 3000)
        await this.run(
            `${IPTABLES} -t nat -A PREROUTING -i ${vlanInterface} -p tcp --dport 80 -j DNAT --to-destination ${gateway}:80`
        );

        // ==========================================

        // 6. Payagan ang authenticated clients sa FORWARD chain
        await this.run(
            `${IPTABLES} -A FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`
        );

        // 7. I-DROP ang traffic ng lahat ng hindi pa authenticated para hindi sila makalusot sa ibang ports
        await this.run(
            `${IPTABLES} -A FORWARD -i ${vlanInterface} -j DROP`
        );

        console.log(`✅ ${vlanInterface} registered.`);
    }

   /**
 * Remove VLAN rules
 */
/**
 * Remove VLAN firewall rules
 */
async unregisterVLAN(
    vlanInterface: string,
    gateway: string
): Promise<void> {

    console.log(
        `🧹 Cleaning firewall rules for ${vlanInterface}`
    );


    // ==========================================
    // INPUT - PORTAL ACCESS
    // ==========================================

    while (
        await this.ruleExists(
            `${IPTABLES} -C INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`
        )
    ) {

        await this.run(
            `${IPTABLES} -D INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`
        );

    }


    // ==========================================
    // FORWARD - AUTHENTICATED CLIENTS
    // ==========================================

    while (
        await this.ruleExists(
            `${IPTABLES} -C FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`
        )
    ) {

        await this.run(
            `${IPTABLES} -D FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`
        );

    }


    // ==========================================
    // FORWARD - UNAUTHENTICATED DROP
    // ==========================================

    while (
        await this.ruleExists(
            `${IPTABLES} -C FORWARD -i ${vlanInterface} -j DROP`
        )
    ) {

        await this.run(
            `${IPTABLES} -D FORWARD -i ${vlanInterface} -j DROP`
        );

    }


    // ==========================================
    // NAT - AUTHENTICATED BYPASS
    // ==========================================

    while (
        await this.ruleExists(
            `${IPTABLES} -t nat -C PREROUTING -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`
        )
    ) {

        await this.run(
            `${IPTABLES} -t nat -D PREROUTING -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`
        );

    }


    // ==========================================
    // NAT - DNS UDP
    // ==========================================

    while (
        await this.ruleExists(
            `${IPTABLES} -t nat -C PREROUTING -i ${vlanInterface} -p udp --dport 53 -j DNAT --to-destination ${gateway}:53`
        )
    ) {

        await this.run(
            `${IPTABLES} -t nat -D PREROUTING -i ${vlanInterface} -p udp --dport 53 -j DNAT --to-destination ${gateway}:53`
        );

    }


    // ==========================================
    // NAT - DNS TCP
    // ==========================================

    while (
        await this.ruleExists(
            `${IPTABLES} -t nat -C PREROUTING -i ${vlanInterface} -p tcp --dport 53 -j DNAT --to-destination ${gateway}:53`
        )
    ) {

        await this.run(
            `${IPTABLES} -t nat -D PREROUTING -i ${vlanInterface} -p tcp --dport 53 -j DNAT --to-destination ${gateway}:53`
        );

    }


    // ==========================================
    // NAT - HTTP PORTAL
    // ==========================================

    while (
        await this.ruleExists(
            `${IPTABLES} -t nat -C PREROUTING -i ${vlanInterface} -p tcp --dport 80 -j DNAT --to-destination ${gateway}:80`
        )
    ) {

        await this.run(
            `${IPTABLES} -t nat -D PREROUTING -i ${vlanInterface} -p tcp --dport 80 -j DNAT --to-destination ${gateway}:80`
        );

    }


    console.log(
        `🧹 Firewall cleanup complete: ${vlanInterface}`
    );

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