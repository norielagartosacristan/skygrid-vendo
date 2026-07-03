import { promises as fs } from "fs";
import path from "path";

const NET_PATH = "/sys/class/net";

export interface InterfaceTraffic {

    name: string;

    rxBytes: number;

    txBytes: number;

    rxPackets: number;

    txPackets: number;

    rxErrors: number;

    txErrors: number;

    rxDropped: number;

    txDropped: number;

}

async function readStat(
    iface: string,
    file: string
): Promise<number> {

    try {

        const value = await fs.readFile(
            path.join(
                NET_PATH,
                iface,
                "statistics",
                file
            ),
            "utf8"
        );

        return Number(value.trim());

    } catch {

        return 0;

    }

}

export class TrafficReader {

    static async getInterfaceTraffic(
        iface: string
    ): Promise<InterfaceTraffic> {

        return {

            name: iface,

            rxBytes: await readStat(iface, "rx_bytes"),

            txBytes: await readStat(iface, "tx_bytes"),

            rxPackets: await readStat(iface, "rx_packets"),

            txPackets: await readStat(iface, "tx_packets"),

            rxErrors: await readStat(iface, "rx_errors"),

            txErrors: await readStat(iface, "tx_errors"),

            rxDropped: await readStat(iface, "rx_dropped"),

            txDropped: await readStat(iface, "tx_dropped"),

        };

    }

    static async getAllTraffic() {

        const interfaces = await fs.readdir(NET_PATH);

        const result = [];

        for (const iface of interfaces) {

            result.push(
                await this.getInterfaceTraffic(
                    iface
                )
            );

        }

        return result;

    }

}