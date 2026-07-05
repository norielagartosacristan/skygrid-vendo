"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.machineStorageService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CONFIG_DIR = "/etc/skygrid";
const CONFIG_FILE = path_1.default.join(CONFIG_DIR, "machine.json");
class MachineStorageService {
    ensure() {
        if (!fs_1.default.existsSync(CONFIG_DIR)) {
            fs_1.default.mkdirSync(CONFIG_DIR, { recursive: true });
        }
        if (!fs_1.default.existsSync(CONFIG_FILE)) {
            fs_1.default.writeFileSync(CONFIG_FILE, JSON.stringify({}, null, 2));
        }
    }
    load() {
        this.ensure();
        return JSON.parse(fs_1.default.readFileSync(CONFIG_FILE, "utf8"));
    }
    save(data) {
        this.ensure();
        fs_1.default.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
    }
}
exports.machineStorageService = new MachineStorageService();
