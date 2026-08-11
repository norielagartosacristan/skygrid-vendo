import "dotenv/config";

import http, { IncomingMessage } from "http";
import { Socket } from "net";
import { URL } from "url";

import app from "./app";
import prisma from "./config/prisma";

import { autoProvision } from "./services/networkProvision.service";

import { networkMonitor } from "./modules/network/services/networkMonitor.service";
import { networkSocket } from "./modules/network/websocket/network.socket";

import { firewallRules } from "./modules/captive/firewall/firewallRules.service";
import { captiveSocket } from "./modules/captive/websocket/captive.socket";
import { sessionScheduler } from "./modules/captive/session/session.scheduler";
import { sessionService } from "./modules/captive/session/session.service";

import { machineService } from "./modules/machine/services/machine.service";
import { machineAssociationService } from "./modules/machine/services/machineAssociation.service";

import { startDeviceMonitor } from "./modules/subvendo/services/device-monitor.service";

const PORT = Number(process.env.PORT) || 5000;

// ======================================================
// HTTP SERVER
// ======================================================

const server = http.createServer(app);

// ======================================================
// WEBSOCKET UPGRADE ROUTER
// ======================================================

server.on(
    "upgrade",
    (
        req: IncomingMessage,
        socket: Socket,
        head: Buffer
    ) => {

        try {

            const pathname =
                new URL(
                    req.url || "/",
                    `http://${req.headers.host || "localhost"}`
                ).pathname;

            console.log(
                "🔌 WS UPGRADE REQUEST:",
                pathname
            );

            // ==================================================
            // NETWORK WEBSOCKET
            // ==================================================

            if (
                pathname ===
                "/ws/network"
            ) {

                networkSocket.upgrade(
                    req,
                    socket,
                    head
                );

                return;
            }

            // ==================================================
            // CAPTIVE SESSION WEBSOCKET
            // ==================================================

            if (
                pathname ===
                "/ws/session"
            ) {

                captiveSocket.upgrade(
                    req,
                    socket,
                    head
                );

                return;
            }

            // ==================================================
            // UNKNOWN WEBSOCKET PATH
            // ==================================================

            console.warn(
                "⚠️ UNKNOWN WS PATH:",
                pathname
            );

            socket.destroy();

        } catch (error) {

            console.error(
                "❌ WS UPGRADE ERROR:",
                error
            );

            socket.destroy();
        }
    }
);

// ======================================================
// DEVICE MONITOR
// ======================================================

startDeviceMonitor();

// ======================================================
// SERVER START
// ======================================================

server.listen(
    PORT,
    async () => {

        console.log(
            `🚀 Backend running on port ${PORT}`
        );

        try {

            // ==================================================
            // 1. FIREWALL INITIALIZATION
            // ==================================================

            console.log(
                "🔥 Starting firewall initialization..."
            );

            await firewallRules.initialize();

            // ==================================================
            // 2. WAN CONFIGURATION
            // ==================================================

            console.log(
                "🔥 Configuring WAN..."
            );

            await firewallRules.configureWAN(
                "enp2s0"
            );

            // ==================================================
            // 3. NETWORK AUTO PROVISION
            // ==================================================

            console.log(
                "🌐 Starting network auto-provision..."
            );

            await autoProvision();

            // ==================================================
            // 4. REGISTER CAPTIVE VLANs
            // ==================================================

            console.log(
                "📡 Registering captive VLANs..."
            );

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

            for (
                const vlan
                of captiveVLANs
            ) {

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

            // ==================================================
            // 5. MACHINE
            // ==================================================

            const machine =
                await machineService.register();

            console.log(
                "Machine Registered"
            );

            console.log(
                machine
            );

            await machineService.repairSubVendo(
                machine.id
            );

            await machineAssociationService
                .restoreSubVendoAssociations(
                    machine.id
                );

            // ==================================================
            // 6. NETWORK MONITOR
            // ==================================================

            console.log(
                "📡 Starting network monitor..."
            );

            await networkMonitor.update();

            // ==================================================
            // TEMPORARILY NO setInterval
            // ==================================================
            //
            // Once WebSocket is confirmed stable,
            // we can enable the monitor interval again.
            //
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

            // ==================================================
            // 7. RESTORE ACTIVE SESSIONS
            // ==================================================

            console.log(
                "🔄 Restoring active sessions..."
            );

            await sessionService
                .restoreActiveSessions();

            // ==================================================
            // 8. SESSION SCHEDULER
            // ==================================================

            sessionScheduler.start();

            console.log(
                "🕒 Session Scheduler Started"
            );

            console.log(
                "========================================"
            );

            console.log(
                "✅ SKYGRID VENDO BACKEND READY"
            );

            console.log(
                "========================================"
            );

        } catch (err) {

            console.error(
                "❌ Backend startup failed:",
                err
            );
        }
    }
);