"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const networkProvision_service_1 = require("./services/networkProvision.service");
const networkMonitor_service_1 = require("./modules/network/services/networkMonitor.service");
const network_socket_1 = require("./modules/network/websocket/network.socket");
const firewallRules_service_1 = require("./modules/captive/firewall/firewallRules.service");
const machine_service_1 = require("./modules/machine/services/machine.service");
const session_scheduler_1 = require("./modules/captive/session/session.scheduler");
const PORT = process.env.PORT || 5000;
const server = http_1.default.createServer(app_1.default);
// Initialize WebSocket
network_socket_1.networkSocket.init(server);
server.listen(PORT, async () => {
    console.log(`🚀 Server running on ${PORT}`);
    try {
        // Auto Provision
        await (0, networkProvision_service_1.autoProvision)();
        // Register Machine
        const machine = await machine_service_1.machineService.register();
        console.log("✅ Machine Registered:");
        console.log(machine);
        // Update network information
        await networkMonitor_service_1.networkMonitor.update();
        setInterval(async () => {
            await networkMonitor_service_1.networkMonitor.update();
        }, 1000);
        // Initialize firewall
        await firewallRules_service_1.firewallRules.initialize();
        await firewallRules_service_1.firewallRules.configureWAN("enp2s0");
        await firewallRules_service_1.firewallRules.registerVLAN("enp2s0.22", "10.0.0.1");
        // Start automatic session expiration
        session_scheduler_1.sessionScheduler.start();
        console.log("✅ Session Scheduler Started");
    }
    catch (err) {
        console.error("Startup Error:", err);
    }
});
