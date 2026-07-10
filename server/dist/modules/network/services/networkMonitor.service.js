"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networkMonitor = void 0;
const linuxReader_1 = require("../linux/linuxReader");
const trafficReader_1 = require("../linux/trafficReader");
const network_socket_1 = require("../websocket/network.socket");
class NetworkMonitor {
    previous = new Map();
    cache = [];
    async update() {
        console.log("NETWORK UPDATE", new Date().toISOString());
        const interfaces = await linuxReader_1.LinuxReader.getInterfaces();
        console.log("Interfaces:", interfaces);
        const traffic = await trafficReader_1.TrafficReader.getAllTraffic();
        console.log("Traffic:", traffic);
        const now = Date.now();
        this.cache = interfaces.map((iface) => {
            const stat = traffic.find(t => t.name === iface.name);
            let rxMbps = 0;
            let txMbps = 0;
            if (stat) {
                const prev = this.previous.get(iface.name);
                if (prev) {
                    const seconds = (now - prev.time) / 1000;
                    rxMbps =
                        ((stat.rxBytes - prev.rx) * 8) /
                            seconds /
                            1000000;
                    txMbps =
                        ((stat.txBytes - prev.tx) * 8) /
                            seconds /
                            1000000;
                }
                this.previous.set(iface.name, {
                    rx: stat.rxBytes,
                    tx: stat.txBytes,
                    time: now,
                });
            }
            const ipv4 = iface.addresses?.find((a) => a.family === "inet")?.address || "";
            return {
                id: iface.name,
                displayName: iface.name,
                name: iface.name,
                role: "-", // pwede mong lagyan mamaya ng WAN/LAN
                type: iface.type,
                ipAddress: ipv4,
                macAddress: iface.mac,
                status: iface.state,
                rxMbps: Number(rxMbps.toFixed(2)),
                txMbps: Number(txMbps.toFixed(2)),
                traffic: stat,
            };
        });
        // Broadcast pagkatapos ma-update ang cache
        network_socket_1.networkSocket.broadcast(this.cache);
    }
    getData() {
        return this.cache;
    }
}
exports.networkMonitor = new NetworkMonitor();
