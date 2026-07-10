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

    async update() {
    console.log("NETWORK UPDATE", new Date().toISOString());

    const interfaces =
        await LinuxReader.getInterfaces();

    const traffic =
        await TrafficReader.getAllTraffic();

    const now = Date.now();

    this.cache = interfaces.map((iface) => {

        const stat = traffic.find(
            t => t.name === iface.name
        );

        let rxMbps = 0;
        let txMbps = 0;

        if (stat) {

            const prev = this.previous.get(
                iface.name
            );

            if (prev) {

                const seconds =
                    (now - prev.time) / 1000;

                rxMbps =
                    ((stat.rxBytes - prev.rx) * 8) /
                    seconds /
                    1000000;

                txMbps =
                    ((stat.txBytes - prev.tx) * 8) /
                    seconds /
                    1000000;

            }

            this.previous.set(
                iface.name,
                {
                    rx: stat.rxBytes,
                    tx: stat.txBytes,
                    time: now,
                }
            );

        }

        return {

            ...iface,

            rxMbps: Number(rxMbps.toFixed(2)),

            txMbps: Number(txMbps.toFixed(2)),

            traffic: stat,

        };

    });

    // Broadcast pagkatapos ma-update ang cache
    networkSocket.broadcast(this.cache);

}
    getData() {

        return this.cache;

    }

}

export const networkMonitor =
    new NetworkMonitor();