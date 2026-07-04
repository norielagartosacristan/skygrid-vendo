"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voucher_controller_1 = require("../controllers/voucher.controller");
const router = (0, express_1.Router)();
router.post("/generate", voucher_controller_1.voucherController.generate);
exports.default = router;
