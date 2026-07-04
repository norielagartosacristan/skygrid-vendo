"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = getStatus;
const networkMonitor_service_1 = require("../services/networkMonitor.service");
async function getStatus(req, res) {
    res.json(networkMonitor_service_1.networkMonitor.getData());
}
