import { exec } from "child_process";
import { promisify } from "util";
import { promises as fs } from "fs";

const execAsync = promisify(exec);

export interface LinuxInterface {
    name: string;
    state: string;
    mac: string;
    mtu: number;
    type: "Physical" | "VLAN" | "Bridge" | "Loopback";
    addresses: {
        family: string;
        ip: string;
        prefix: number;
    }[];
}

export class LinuxReader {

    static async getInterfaces(): Promise<LinuxInterface[]> {

        const { stdout } = await execAsync("ip -j addr show");

        const data = JSON.parse(stdout);

        return data.map((iface: any) => ({

            name: iface.ifname,

            state: iface.operstate,

            mac: iface.address,

            mtu: iface.mtu,

            type: this.detectType(iface.ifname),

            addresses:
                iface.addr_info?.map((addr: any) => ({
                    family: addr.family,
                    ip: addr.local,
                    prefix: addr.prefixlen,
                })) || [],

        }));
    }

    static detectType(name: string): LinuxInterface["type"] {

        if (name === "lo")
            return "Loopback";

        if (name.includes("."))
            return "VLAN";

        if (name.startsWith("br"))
            return "Bridge";

        return "Physical";

    }

    static async getGateway() {

        try {

            const { stdout } = await execAsync(
                "ip route | grep default"
            );

            const parts = stdout.trim().split(" ");

            return {
                gateway: parts[2],
                interface: parts[4],
            };

        } catch {

            return null;

        }

    }

    static async getDNSServers() {

        try {

            const file = await fs.readFile(
                "/etc/resolv.conf",
                "utf8"
            );

            return file
                .split("\n")
                .filter(line => line.startsWith("nameserver"))
                .map(line => line.split(/\s+/)[1]);

        } catch {

            return [];

        }

    }

    static async isInternetOnline() {

        try {

            await execAsync(
                "ping -c 1 -W 1 8.8.8.8"
            );

            return true;

        } catch {

            return false;

        }

    }

    static async getHostname() {

        const { stdout } =
            await execAsync("hostname");

        return stdout.trim();

    }

    static async getKernel() {

        const { stdout } =
            await execAsync("uname -r");

        return stdout.trim();

    }

}