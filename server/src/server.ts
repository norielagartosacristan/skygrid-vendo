import "dotenv/config";
import app from "./app";

import http from "http";

import { autoProvision } from "./services/networkProvision.service";
import { networkMonitor } from "./modules/network/services/networkMonitor.service";
import { networkSocket } from "./modules/network/websocket/network.socket";
import { firewallRules } from "./modules/captive/firewall/firewallRules.service";
import { machineService } from "./modules/machine/services/machine.service";
import { sessionScheduler } from "./modules/captive/session/session.scheduler";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize WebSocket
networkSocket.init(server);

server.listen(PORT, async () => {

    console.log(`🚀 Server running on ${PORT}`);

    try {

        // Auto Provision
        await autoProvision();

        // Register Machine
        const machine = await machineService.register();

        console.log("✅ Machine Registered:");
        console.log(machine);

        // Update network information
        await networkMonitor.update();

        // Initialize firewall
        await firewallRules.initialize();

        await firewallRules.configureWAN(
            "enp2s0"
        );

        await firewallRules.registerVLAN(
            "enp2s0.22",
            "10.0.0.1"
        );

        // Start automatic session expiration
        sessionScheduler.start();

        console.log("✅ Session Scheduler Started");

    } catch (err) {

        console.error("Startup Error:", err);

    }

});