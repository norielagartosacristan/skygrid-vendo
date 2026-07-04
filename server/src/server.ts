import "dotenv/config";
import app from "./app";

import { autoProvision } from "./services/networkProvision.service";
import { networkMonitor } from "./modules/network/services/networkMonitor.service";
import http from "http";
import { networkSocket } from "./modules/network/websocket/network.socket";
import { firewallRules } from "./modules/captive/firewall/firewallRules.service";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

networkSocket.init(server);


server.listen(PORT, async () => {

    console.log(`🚀 Server running on ${PORT}`);

    try {

        // Auto Provision
        await autoProvision();

        // First update immediately
        await networkMonitor.update();

        await firewallRules.initialize();

        await firewallRules.configureWAN("enp2s0");

        await firewallRules.registerVLAN(
            "enp2s0.22",
            "10.0.0.1"
        );

        // Update every second
        setInterval(async () => {

            try {

                await networkMonitor.update();

            } catch (err) {

                console.error("Network Monitor Error:", err);

            }

        }, 1000);

    } catch (err) {

        console.error("Startup Error:", err);

    }

});