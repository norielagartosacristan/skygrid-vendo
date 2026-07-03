import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function getInterfaces() {
  const { stdout } = await execAsync("ip -j addr show");

  const interfaces = JSON.parse(stdout);

  return interfaces.map((iface: any) => ({
    name: iface.ifname,
    state: iface.operstate,
    mac: iface.address,
    addresses:
      iface.addr_info?.map((addr: any) => ({
        family: addr.family,
        ip: addr.local,
        prefix: addr.prefixlen,
      })) || [],
  }));
}