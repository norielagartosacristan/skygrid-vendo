"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firewallService = void 0;
const util_1 = require("util");
const child_process_1 = require("child_process");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class FirewallService {
    /**
     * Execute shell command
     */
    async run(command) {
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
    async allowClient(ip) {
        await this.run(`sudo iptables -I FORWARD -s ${ip} -j ACCEPT`);
        console.log(`✅ Client Allowed: ${ip}`);
    }
    /**
     * Block client internet access
     */
    async blockClient(ip) {
        try {
            await this.run(`sudo iptables -D FORWARD -s ${ip} -j ACCEPT`);
        }
        catch {
            // Ignore if rule doesn't exist
        }
        console.log(`❌ Client Blocked: ${ip}`);
    }
    /**
     * Block all VLAN traffic to Internet
     */
    async enableCaptivePortal(vlan = "enp2s0.22") {
        await this.run(`sudo iptables -C FORWARD -i ${vlan} -j DROP || sudo iptables -A FORWARD -i ${vlan} -j DROP`);
        console.log("🔒 Captive Portal Enabled");
    }
    /**
     * Disable captive portal
     */
    async disableCaptivePortal(vlan = "enp2s0.22") {
        try {
            await this.run(`sudo iptables -D FORWARD -i ${vlan} -j DROP`);
        }
        catch {
            // Ignore
        }
        console.log("🔓 Captive Portal Disabled");
    }
    /**
     * Show all FORWARD rules
     */
    async listRules() {
        return await this.run("sudo iptables -L FORWARD -n --line-numbers");
    }
    /**
     * Flush FORWARD chain
     */
    async flushForward() {
        await this.run("sudo iptables -F FORWARD");
        console.log("🗑 FORWARD chain cleared");
    }
}
exports.firewallService = new FirewallService();
