"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterfaces = getInterfaces;
const child_process_1 = require("child_process");
const util_1 = require("util");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function getInterfaces() {
    const { stdout } = await execAsync("ip -j addr show");
    const linuxInterfaces = JSON.parse(stdout);
    const dbInterfaces = await prisma_1.default.networkInterface.findMany();
    return linuxInterfaces.map((iface) => {
        const db = dbInterfaces.find((i) => i.name === iface.ifname);
        const ipv4 = iface.addr_info?.find((a) => a.family === "inet");
        return {
            id: db?.id,
            displayName: db?.displayName ||
                iface.ifname,
            name: iface.ifname,
            role: db?.role || "-",
            type: db?.type ||
                (iface.ifname.includes(".")
                    ? "VLAN"
                    : "Physical"),
            ipAddress: ipv4?.local || "",
            macAddress: iface.address,
            status: iface.operstate,
            enabled: iface.operstate === "UP",
            prefix: ipv4?.prefixlen,
            gateway: db?.gateway || "",
        };
    });
}
