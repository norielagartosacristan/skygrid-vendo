"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const networkProvision_service_1 = require("./services/networkProvision.service");
const networkMonitor_service_1 = require("./modules/network/services/networkMonitor.service");
const http_1 = __importDefault(require("http"));
const network_socket_1 = require("./modules/network/websocket/network.socket");
const firewallRules_service_1 = require("./modules/captive/firewall/firewallRules.service");
const PORT = process.env.PORT || 5000;
const server = http_1.default.createServer(app_1.default);
network_socket_1.networkSocket.init(server);
server.listen(PORT, async () => {
    console.log(`🚀 Server running on ${PORT}`);
    try {
        // Auto Provision
        await (0, networkProvision_service_1.autoProvision)();
        // First update immediately
        await networkMonitor_service_1.networkMonitor.update();
        await firewallRules_service_1.firewallRules.initialize();
        await firewallRules_service_1.firewallRules.configureWAN("enp2s0");
        await firewallRules_service_1.firewallRules.registerVLAN("enp2s0.22", "10.0.0.1");
        // Update every second
        setInterval(async () => {
            try {
                await networkMonitor_service_1.networkMonitor.update();
            }
            catch (err) {
                console.error("Network Monitor Error:", err);
            }
        }, 1000);
    }
    catch (err) {
        console.error("Startup Error:", err);
    }
});
