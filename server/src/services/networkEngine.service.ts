import os from "os";

export function detectInterfaces() {
    const interfaces = os.networkInterfaces();

    const result = [];

    for (const name in interfaces) {

        const lower = name.toLowerCase();

        if (
            lower.includes("loopback") ||
            lower.includes("virtual") ||
            lower.includes("vmware") ||
            lower.includes("docker") ||
            lower.includes("wireguard") ||
            lower.includes("hyper-v") ||
            lower.includes("vpn")
        ) {
            continue;
        }

        const ipv4 = interfaces[name]?.find(
            (a) => a.family === "IPv4"
        );

        result.push({
            name,
            ipAddress: ipv4?.address ?? "",
            subnetMask: ipv4?.netmask ?? "",
            mac: ipv4?.mac ?? "",
        });
    }

    return result;
}