import prisma from "../config/prisma";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

const DHCP_DIR = "/etc/dnsmasq.d/skygrid";
const DNSMASQ_SERVICE = "dnsmasq";

class DHCPProvisionService {

    private async run(command: string): Promise<string> {

        console.log(`[DHCP] ${command}`);

        try {

            const { stdout, stderr } =
                await execAsync(command);

            if (stderr) {
                console.warn("[DHCP stderr]", stderr);
            }

            return stdout;

        } catch (error: any) {

            console.error(
                "[DHCP ERROR]",
                command
            );

            console.error(
                error.stderr || error.message
            );

            throw error;
        }
    }

    /**
     * Ensure SkyGrid dnsmasq directory exists
     */
    async initialize(): Promise<void> {

        await this.run(
            `sudo mkdir -p ${DHCP_DIR}`
        );

        console.log(
            `✅ DHCP directory ready: ${DHCP_DIR}`
        );
    }

    /**
     * Convert subnet mask to prefix
     */
    private subnetMaskToPrefix(
        subnetMask?: string | null
    ): number {

        if (!subnetMask) {
            return 24;
        }

        const parts =
            subnetMask
                .split(".")
                .map(Number);

        if (
            parts.length !== 4 ||
            parts.some(Number.isNaN)
        ) {
            return 24;
        }

        const binary =
            parts
                .map(part =>
                    part
                        .toString(2)
                        .padStart(8, "0")
                )
                .join("");

        return binary
            .split("1")
            .length - 1;
    }

    /**
     * Generate DHCP configuration for one VLAN
     */
    async provisionVLAN(
        networkInterface: any
    ): Promise<void> {

        if (
            networkInterface.type !== "VLAN" ||
            !networkInterface.enabled ||
            !networkInterface.dhcpEnabled
        ) {
            return;
        }

        const {
            name,
            ipAddress,
            subnetMask,
            dhcpStart,
            dhcpEnd,
        } = networkInterface;

        if (
            !name ||
            !ipAddress ||
            !subnetMask ||
            !dhcpStart ||
            !dhcpEnd
        ) {

            console.warn(
                `⚠️ Incomplete DHCP configuration for ${name}`
            );

            return;
        }

        const prefix =
            this.subnetMaskToPrefix(
                subnetMask
            );

        const config = `
# ==========================================
# SkyGrid DHCP
# Interface: ${name}
# Gateway: ${ipAddress}
# ==========================================

interface=${name}
dhcp-range=${dhcpStart},${dhcpEnd},${subnetMask},12h
dhcp-option=3,${ipAddress}
dhcp-option=6,${ipAddress}
`;

        const filePath =
            path.join(
                DHCP_DIR,
                `${name}.conf`
            );

        const tempPath =
            `${filePath}.tmp`;

        await fs.writeFile(
            `/tmp/skygrid-dhcp.conf`,
            config,
            "utf8"
        );

        await this.run(
            `sudo cp /tmp/skygrid-dhcp.conf '${filePath}'`
        );

        console.log(
            `✅ DHCP configured: ${name} → ${ipAddress}/${prefix}`
        );
    }

    /**
     * Remove DHCP configuration for VLAN
     */
    async removeVLAN(
        interfaceName: string
    ): Promise<void> {

        const filePath =
            path.join(
                DHCP_DIR,
                `${interfaceName}.conf`
            );

        await this.run(
            `sudo rm -f '${filePath}'`
        );

        console.log(
            `🧹 DHCP removed: ${interfaceName}`
        );
    }

    /**
     * Synchronize ALL VLAN DHCP configurations
     */
    async syncAll(): Promise<void> {

        console.log(
            "🔄 Synchronizing SkyGrid DHCP..."
        );

        await this.initialize();

        const interfaces =
            await prisma.networkInterface.findMany({
                where: {
                    type: "VLAN",
                    enabled: true,
                    dhcpEnabled: true,
                },
                orderBy: {
                    vlanId: "asc",
                },
            });

        console.log(
            `📡 DHCP VLANs found: ${interfaces.length}`
        );

        for (const networkInterface of interfaces) {

            await this.provisionVLAN(
                networkInterface
            );
        }

        await this.reloadDnsmasq();

        console.log(
            "✅ SkyGrid DHCP synchronization complete"
        );
    }

    /**
     * Reload dnsmasq
     */
    async reloadDnsmasq(): Promise<void> {

        await this.run(
            `sudo systemctl reload ${DNSMASQ_SERVICE}`
        );

        console.log(
            "🔄 dnsmasq reloaded"
        );
    }
}

export const dhcpProvision =
    new DHCPProvisionService();