import "dotenv/config";
import app from "./app";

import { autoProvision } from "./services/networkProvision.service";
import { networkMonitor } from "./modules/network/services/networkMonitor.service";
import http from "http";
import { networkSocket } from "./modules/network/websocket/network.socket";
import { firewallRules } from "./modules/captive/firewall/firewallRules.service";
import { machineService } from "./modules/machine/services/machine.service";
import prisma from "./config/prisma";
import { ipsetService } from "./modules/captive/firewall/ipset.service";
import { exec } from "child_process";
import { sessionScheduler } from "./modules/captive/session/session.scheduler";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

networkSocket.init(server);


server.listen(PORT, async () => {

    console.log(`🚀 Server running on ${PORT}`);

    try {

        // Auto Provision
        await autoProvision();
        const machine = await machineService.register();

        console.log("✅ Machine Registered:");
        console.log(machine);

        // First update immediately
        await networkMonitor.update();

        await firewallRules.initialize();

        await firewallRules.configureWAN("enp2s0");

        await firewallRules.registerVLAN(
            "enp2s0.22",
            "10.0.0.1"
        );
        sessionScheduler.start();

        // Update every second
        setInterval(async () => {

    try {

        const expired = await prisma.session.findMany({

            where: {
                isActive: true,
                expiresAt: {
                    lte: new Date()
                }
            }

        });

        for (const session of expired) {

            console.log(
                `Expiring ${session.ipAddress}`
            );

            await prisma.session.update({

                where: {
                    id: session.id
                },

                data: {
                    isActive: false
                }

            });

            await ipsetService.removeIP(
                session.ipAddress
            );

            exec(
                `conntrack -D -s ${session.ipAddress} || true`
            );

        }

    } catch (err) {

        console.error(
            "Expire Session Error:",
            err
        );

    }

}, 5000);

    } catch (err) {

        console.error("Startup Error:", err);

    }

});