import "dotenv/config";
import app from "./app";

import http from "http";

import { autoProvision } from "./services/networkProvision.service";
import { networkMonitor } from "./modules/network/services/networkMonitor.service";
import { networkSocket } from "./modules/network/websocket/network.socket";

import { firewallRules } from "./modules/captive/firewall/firewallRules.service";
import { captiveSocket } from "./modules/captive/websocket/captive.socket";
import { sessionScheduler } from "./modules/captive/session/session.scheduler";

import { machineService } from "./modules/machine/services/machine.service";

import { subVendoSocket } from "./modules/subvendo/websocket/subvendo.socket";
import { startDeviceMonitor } from "./modules/subvendo/services/device-monitor.service";


const PORT = Number(process.env.PORT) || 5000;

// ONE HTTP SERVER ONLY
const server = http.createServer(app);

//server.on("upgrade", (req, socket) => {
  //  console.log("================================");
    //console.log("UPGRADE:", req.url);
    //console.log("================================");

    //socket.on("error", (err) => {
      //  console.error("UPGRADE SOCKET ERROR:", err);
    //});
//});

// Initialize all websocket modules
networkSocket.init(server);
console.log("Network WS Initialized");

captiveSocket.init(server);
console.log("Captive WS Initialized");

subVendoSocket.initialize(server);
console.log("SUBVENDO WS INITIALIZED");

startDeviceMonitor();

server.listen(PORT, async () => {

    console.log(`🚀 Backend running on port ${PORT}`);

    try {

        await autoProvision();

        const machine = await machineService.register();

        console.log("Machine Registered");
        console.log(machine);

        await networkMonitor.update();

        setInterval(async () => {

            await networkMonitor.update();

        }, 1000);

        await firewallRules.initialize();

        await firewallRules.configureWAN("enp2s0");

        await firewallRules.registerVLAN(
            "enp2s0.22",
            "10.0.0.1"
        );

        sessionScheduler.start();

        console.log("Session Scheduler Started");

    } catch (err) {

        console.error(err);

    }

});