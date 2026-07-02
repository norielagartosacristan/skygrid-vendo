import os from "os";

export function getStatus() {
  const interfaces = os.networkInterfaces();

  const result = [];

  for (const name in interfaces) {

    const lower = name.toLowerCase();

    if (
      lower.includes("loopback") ||
      lower.includes("wireguard") ||
      lower.includes("virtual") ||
      lower.includes("docker") ||
      lower.includes("vmware") ||
      lower.includes("hyper-v") ||
      lower.includes("vpn")
    ) {
      continue;
    }

    const ipv4 = interfaces[name]?.find(
      (a) => a.family === "IPv4" && !a.internal
    );

    if (!ipv4) continue;

    result.push({
      interface: name,
      ipAddress: ipv4.address,
      subnetMask: ipv4.netmask,
      macAddress: ipv4.mac,
      status: "UP",
    });
  }

  return result;
}