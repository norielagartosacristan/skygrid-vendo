"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listInterfaces = listInterfaces;
exports.getIPAddress = getIPAddress;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function listInterfaces() {
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
async function getIPAddress(iface) {
    try {
        const { stdout } = await execAsync(`ip -4 addr show ${iface}`);
        return stdout;
    }
    catch {
        return "";
    }
}
