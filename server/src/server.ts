import "dotenv/config";
import app from "./app";

import http from "http";
import prisma from "./config/prisma";
import { autoProvision } from "./services/networkProvision.service";
import { networkMonitor } from "./modules/network/services/networkMonitor.service";
import { networkSocket } from "./modules/network/websocket/network.socket";

import { firewallRules } from "./modules/captive/firewall/firewallRules.service";
import { captiveSocket } from "./modules/captive/websocket/captive.socket";
import { sessionScheduler } from "./modules/captive/session/session.scheduler";

import { machineService } from "./modules/machine/services/machine.service";
import { startDeviceMonitor } from "./modules/subvendo/services/device-monitor.service";
import { sessionService } from "./modules/captive/session/session.service";
import { machineAssociationService } from "./modules/machine/services/machineAssociation.service";


const PORT = Number(process.env.PORT) || 5000;

// ONE HTTP SERVER ONLY
const server = http.createServer(app);

networkSocket.init(server);
console.log("Network WS Initialized");

captiveSocket.init(server);
console.log("Captive WS Initialized");


startDeviceMonitor();

server.listen(PORT, async () => {

    console.log(`🚀 Backend running on port ${PORT}`);

    try {

        // ========================================
        // 1. NETWORK PROVISION
        // ========================================

        await autoProvision();


        // ========================================
        // 2. FIREWALL INITIALIZATION
        // ========================================

        console.log("🔥 Starting firewall initialization...");

        await firewallRules.initialize();

        console.log("🔥 Configuring WAN...");

        await firewallRules.configureWAN(
            "enp2s0"
        );


        // ========================================
        // 3. REGISTER CAPTIVE VLAN
        // ========================================

        console.log("📡 Registering captive VLANs...");

const captiveVLANs =
    await prisma.networkInterface.findMany({
        where: {
            type: "VLAN",
            enabled: true,
            role: "LAN",
        },
        orderBy: {
            vlanId: "asc",
        },
    });

for (const vlan of captiveVLANs) {

    if (
        !vlan.name ||
        !vlan.ipAddress
    ) {
        console.warn(
            `⚠️ Skipping invalid VLAN: ${vlan.name}`
        );

        continue;
    }

    console.log(
        `📡 Registering ${vlan.name} → gateway ${vlan.ipAddress}`
    );

    await firewallRules.registerVLAN(
        vlan.name,
        vlan.ipAddress
    );
}


        // ========================================
        // 4. MACHINE
        // ========================================

        const machine =
            await machineService.register();

        console.log("Machine Registered");
        console.log(machine);


        await machineService.repairSubVendo(
            machine.id
        );


        await machineAssociationService
            .restoreSubVendoAssociations(
                machine.id
            );


        // ========================================
        // 5. NETWORK MONITOR
        // ========================================

        await networkMonitor.update();

        setInterval(async () => {

            try {

                await networkMonitor.update();

            } catch (err) {

                console.error(
                    "❌ Network monitor error:",
                    err
                );

            }

        }, 1000);


        // ========================================
        // 6. RESTORE ACTIVE SESSIONS
        // ========================================

        console.log(
            "🔄 Restoring active sessions..."
        );

        await sessionService
            .restoreActiveSessions();


        // ========================================
        // 7. OTHER SERVICES
        // ========================================

        await firewallRules
            .initialize();

        await sessionService
            .restoreActiveSessions();

        sessionScheduler.start();

        console.log(
            "✅ Session Scheduler Started"
        );


    } catch (err) {

        console.error(
            "❌ Backend startup failed:",
            err
        );

    }

});