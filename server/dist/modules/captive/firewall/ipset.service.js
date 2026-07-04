"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipsetService = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * Full path to ipset using sudo (NOPASSWD configured)
 */
const IPSET = "sudo /usr/sbin/ipset";
class IPSetService {
    /**
     * Execute shell command
     */
    async run(command) {
        try {
            const { stdout } = await execAsync(command);
            return stdout;
        }
        catch (err) {
            throw new Error(err.stderr || err.message);
        }
    }
    /**
     * Allow client Internet access
     */
    async allow(ip) {
        await this.run(`${IPSET} add skygrid_clients ${ip} -exist`);
        console.log(`✅ Allowed Client: ${ip}`);
    }
    /**
     * Block client Internet access
     */
    async block(ip) {
        try {
            await this.run(`${IPSET} del skygrid_clients ${ip}`);
        }
        catch {
            // Ignore if IP is already removed
        }
        console.log(`❌ Blocked Client: ${ip}`);
    }
    /**
     * Check if client is already allowed
     */
    async exists(ip) {
        try {
            await this.run(`${IPSET} test skygrid_clients ${ip}`);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * List all allowed clients
     */
    async list() {
        return await this.run(`${IPSET} list skygrid_clients`);
    }
    /**
     * Remove all clients
     */
    async clear() {
        await this.run(`${IPSET} flush skygrid_clients`);
        console.log("🧹 Cleared all captive clients");
    }
}
exports.ipsetService = new IPSetService();
