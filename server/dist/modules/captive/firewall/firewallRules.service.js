"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firewallRules = void 0;
const util_1 = require("util");
const child_process_1 = require("child_process");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class FirewallRulesService {
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
    async enableIpForward() {
        await this.run("sysctl -w net.ipv4.ip_forward=1");
    }
    /**
     * Create ipset
     */
    async createIPSet() {
        await this.run("ipset create skygrid_clients hash:ip -exist");
    }
    /**
     * Allow ESTABLISHED connections
     */
    async allowEstablishedConnections() {
        await this.run("iptables -C FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT || iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT");
    }
    /**
     * Add WAN Masquerade
     */
    async configureWAN(wan) {
        await this.run(`iptables -t nat -C POSTROUTING -o ${wan} -j MASQUERADE || iptables -t nat -A POSTROUTING -o ${wan} -j MASQUERADE`);
    }
    /**
     * Register VLAN
     */
    async registerVLAN(vlanInterface, gateway) {
        console.log(`Registering ${vlanInterface}`);
        // Allow access to gateway (portal/API)
        await this.run(`iptables -C INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT || iptables -A INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`);
        // Allow clients that are in ipset
        await this.run(`iptables -C FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT || iptables -A FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`);
        // Block all remaining traffic
        await this.run(`iptables -C FORWARD -i ${vlanInterface} -j DROP || iptables -A FORWARD -i ${vlanInterface} -j DROP`);
    }
    /**
     * Remove VLAN
     */
    async unregisterVLAN(vlanInterface, gateway) {
        await this.run(`iptables -D INPUT -i ${vlanInterface} -d ${gateway} -j ACCEPT`);
        await this.run(`iptables -D FORWARD -i ${vlanInterface} -m set --match-set skygrid_clients src -j ACCEPT`);
        await this.run(`iptables -D FORWARD -i ${vlanInterface} -j DROP`);
    }
    /**
     * Show Rules
     */
    async showRules() {
        return await this.run("iptables -L -n -v");
    }
}
exports.firewallRules = new FirewallRulesService();
