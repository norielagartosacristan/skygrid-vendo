import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function listInterfaces() {
  const { stdout } = await execAsync("ip -o link show");

  return stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(":");
      return {
        name: parts[1].trim(),
      };
    });
}

export async function getIPAddress(iface: string) {
  try {
    const { stdout } = await execAsync(
      `ip -4 addr show ${iface}`
    );

    return stdout;
  } catch {
    return "";
  }
}