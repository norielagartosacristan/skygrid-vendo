"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coin_controller_1 = require("./coin.controller");
const router = (0, express_1.Router)();
router.post("/insert", coin_controller_1.coinController.insert);
exports.default = router;
