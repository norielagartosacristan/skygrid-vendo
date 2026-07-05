"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageController = void 0;
const package_service_1 = require("../services/package.service");
class PackageController {
    async getAll(req, res) {
        try {
            const packages = await package_service_1.packageService.getAll();
            return res.json({
                success: true,
                data: packages
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
exports.packageController = new PackageController();
