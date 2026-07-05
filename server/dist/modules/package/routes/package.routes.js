"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const package_controller_1 = require("../controllers/package.controller");
const router = (0, express_1.Router)();
router.get("/", package_controller_1.packageController.getAll.bind(package_controller_1.packageController));
exports.default = router;
