"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.machineController = void 0;
const machine_service_1 = require("../services/machine.service");
class MachineController {
    async info(req, res) {
        try {
            const machine = await machine_service_1.machineService.getCurrentMachine();
            return res.json({
                success: true,
                data: machine
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async register(req, res) {
        try {
            const machine = await machine_service_1.machineService.register();
            return res.json({
                success: true,
                data: machine
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.machineController = new MachineController();
