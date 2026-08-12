import { LinuxReader } from "../linux/linuxReader";
import { TrafficReader } from "../linux/trafficReader";
import { networkSocket } from "../websocket/network.socket";

class NetworkMonitor {

    private previous = new Map<
        string,
        {
            rx: number;
            tx: number;
            time: number;
        }
    >();

    private cache: any[] = [];

    /**
     * Build the current network interface data.
     */
    private async collectInterfaces() {

        const interfaces =
            await LinuxReader.getInterfaces();

        console.log(
            "Interfaces:",
            interfaces
        );

        // Hide loopback interface
        const visibleInterfaces =
            interfaces.filter(
                (iface) => iface.name !== "lo"
            );

        const traffic =
            await TrafficReader.getAllTraffic();

        console.log(
            "Traffic:",
            traffic
        );

        const now = Date.now();

        return visibleInterfaces.map(
            (iface) => {

                const stat =
                    traffic.find(
                        (t) =>
                            t.name === iface.name
                    );

                let rxMbps = 0;
                let txMbps = 0;

                /**
                 * Calculate traffic speed
                 */
                if (stat) {

                    const previous =
                        this.previous.get(
                            iface.name
                        );

                    if (previous) {

                        const seconds =
                            (now - previous.time) /
                            1000;

                        if (seconds > 0) {

                            rxMbps =
                                (
                                    (stat.rxBytes -
                                        previous.rx) *
                                    8
                                ) /
                                seconds /
                                1_000_000;

                            txMbps =
                                (
                                    (stat.txBytes -
                                        previous.tx) *
                                    8
                                ) /
                                seconds /
                                1_000_000;

                        }

                    }

                    /**
                     * Save current counters
                     * for next calculation.
                     */
                    this.previous.set(
                        iface.name,
                        {
                            rx: stat.rxBytes,
                            tx: stat.txBytes,
                            time: now,
                        }
                    );

                }

                /**
                 * Get IPv4 address
                 */
                const ipv4 =
                    iface.addresses?.find(
                        (address: any) =>
                            address.family === "inet"
                    )?.ip || "";

                /**
                 * Determine interface role
                 */
                let role = "-";

                if (
                    iface.type ===
                    "Physical"
                ) {

                    role = "WAN";

                } else if (
                    iface.type ===
                    "VLAN"
                ) {

                    role = "LAN";

                }

                return {

                    id: iface.name,

                    displayName:
                        iface.name,

                    name:
                        iface.name,

                    role,

                    type:
                        iface.type,

                    ipAddress:
                        ipv4,

                    macAddress:
                        iface.mac,

                    status:
                        iface.state,

                    rxMbps:
                        Number(
                            rxMbps.toFixed(2)
                        ),

                    txMbps:
                        Number(
                            txMbps.toFixed(2)
                        ),

                    traffic:
                        stat,

                };

            }
        );

    }

    /**
     * Update network information
     * and broadcast it to WebSocket clients.
     */
    async update() {

        console.log(
            "================================"
        );

        console.log(
            "NETWORK UPDATE",
            new Date().toISOString()
        );

        console.log(
            "================================"
        );

        try {

            this.cache =
                await this.collectInterfaces();

            console.log(
                "📡 NETWORK CACHE UPDATED:",
                this.cache.length
            );

            console.log(
                "📡 NETWORK CACHE:",
                this.cache
            );

            /**
             * Send updated data
             * to connected dashboard clients.
             */
            networkSocket.broadcast(
                this.cache
            );

        } catch (error) {

            console.error(
                "❌ NETWORK UPDATE ERROR:",
                error
            );

        }

    }

    /**
     * Return the latest cached
     * network interface information.
     */
    getData() {

        return this.cache;

    }

    /**
     * Force refresh of network
     * information.
     *
     * This also updates the cache
     * and broadcasts the result.
     */
    async refresh() {

        console.log(
            "🔄 NETWORK REFRESH"
        );

        try {

            this.cache =
                await this.collectInterfaces();

            console.log(
                "📡 NETWORK REFRESH CACHE:",
                this.cache.length
            );

            networkSocket.broadcast(
                this.cache
            );

        } catch (error) {

            console.error(
                "❌ NETWORK REFRESH ERROR:",
                error
            );

        }

    }

}

export const networkMonitor =
    new NetworkMonitor();