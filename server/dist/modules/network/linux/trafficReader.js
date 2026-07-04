"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficReader = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const NET_PATH = "/sys/class/net";
async function readStat(iface, file) {
    try {
        const value = await fs_1.promises.readFile(path_1.default.join(NET_PATH, iface, "statistics", file), "utf8");
        return Number(value.trim());
    }
    catch {
        return 0;
    }
}
class TrafficReader {
    static async getInterfaceTraffic(iface) {
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
        const interfaces = await fs_1.promises.readdir(NET_PATH);
        const result = [];
        for (const iface of interfaces) {
            result.push(await this.getInterfaceTraffic(iface));
        }
        return result;
    }
}
exports.TrafficReader = TrafficReader;
