"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firewallRules = void 0;
const util_1 = require("util");
const child_process_1 = require("child_process");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const IPTABLES = "sudo /usr/sbin/iptables";
const IPSET = "sudo /usr/sbin/ipset";
const SYSCTL = "sudo /usr/sbin/sysctl";
class FirewallRulesService {
    /**
     * Execute shell command
     */
    async run(command) {
        console.log("[Firewall]", command);
        try {
            const { stdout, stderr } = await execAsync(command);
            if (stderr) {
                console.warn(stderr);
            }
            return stdout;
        }
        catch (err) {
            console.error("[Firewall]", err.stderr || err.message);
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
    async enableIpForward() {
        await this.run(`${SYSCTL} -w net.ipv4.ip_forward=1`);
    }
    /**
     * Create IPSET
     */
    async createIPSet() {
        await this.run(`${IPSET} create skygrid_clients hash:ip -exist`);
    }
    /**
     * Allow established connections
     */
    async allowEstablishedConnections() {
        await this.run(`${IPTABLES} -C FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT || ${IPTABLES} -I FORWARD 1 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT`);
    }
    /**
     * Configure WAN masquerade
     */
    async configureWAN(wan) {
        await this.run(`${IPTABLES} -t nat -C POSTROUTING -o ${wan} -j MASQUERADE || ${IPTABLES} -t nat -A POSTROUTING -o ${wan} -j MASQUERADE`);
    }
    /**
     * Register Captive VLAN
     */
    async registerVLAN(vlanInterface, gateway) {
        console.log(`📡 Registering ${vlanInterface}`);
        //
        // Remove old rules first
        //
        await this.unregisterVLAN(vlanInterface, gateway);
        //
        // Allow portal access
        //
        await this.run(`${IPTABLES} -C INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT || ${IPTABLES} -A INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`);
        //
        // Allow authenticated clients
        //
        await this.run(`${IPTABLES} -I FORWARD 2 -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`);
        //
        // Block everyone else
        //
        await this.run(`${IPTABLES} -A FORWARD -i ${vlanInterface} -j DROP`);
        console.log(`✅ ${vlanInterface} registered.`);
    }
    /**
     * Remove VLAN rules
     */
    async unregisterVLAN(vlanInterface, gateway) {
        while (true) {
            const result = await this.run(`${IPTABLES} -D INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`);
            if (!result)
                break;
        }
        while (true) {
            const result = await this.run(`${IPTABLES} -D FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`);
            if (!result)
                break;
        }
        while (true) {
            const result = await this.run(`${IPTABLES} -D FORWARD -i ${vlanInterface} -j DROP`);
            if (!result)
                break;
        }
    }
    /**
     * Show firewall rules
     */
    async showRules() {
        return this.run(`${IPTABLES} -L -n -v --line-numbers`);
    }
}
exports.firewallRules = new FirewallRulesService();
