"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const machine_controller_1 = require("../controllers/machine.controller");
const router = (0, express_1.Router)();
router.get("/", machine_controller_1.machineController.info.bind(machine_controller_1.machineController));
router.post("/register", machine_controller_1.machineController.register.bind(machine_controller_1.machineController));
exports.default = router;
