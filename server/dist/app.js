"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const networkGeneral_routes_1 = __importDefault(require("./routes/networkGeneral.routes"));
const globalBandwidth_routes_1 = __importDefault(require("./routes/globalBandwidth.routes"));
const clientControl_routes_1 = __importDefault(require("./routes/clientControl.routes"));
const networkInterface_routes_1 = __importDefault(require("./routes/networkInterface.routes"));
//import subVendoRoutes from "./routes/subVendo.routes";
const networkEngine_routes_1 = __importDefault(require("./routes/networkEngine.routes"));
const networkStatus_routes_1 = __importDefault(require("./routes/networkStatus.routes"));
const linuxNetwork_routes_1 = __importDefault(require("./routes/linuxNetwork.routes"));
const network_routes_1 = __importDefault(require("./modules/network/routes/network.routes"));
const interface_routes_1 = __importDefault(require("./modules/network/routes/interface.routes"));
const captive_routes_1 = __importDefault(require("./modules/captive/routes/captive.routes"));
const voucher_routes_1 = __importDefault(require("./modules/voucher/routes/voucher.routes"));
const package_routes_1 = __importDefault(require("./modules/package/routes/package.routes"));
const machine_routes_1 = __importDefault(require("./modules/machine/routes/machine.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const coin_routes_1 = __importDefault(require("./modules/payment/coin/coin.routes"));
const payment_routes_1 = __importDefault(require("./modules/payment/payment.routes"));
const subvendo_routes_1 = __importDefault(require("./modules/subvendo/routes/subvendo.routes"));
const app = (0, express_1.default)();
const CLIENT_BUILD_PATH = path_1.default.resolve(process.cwd(), "client/dist");
app.set("trust proxy", true);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
/* =========================
   API ROUTES (ALWAYS FIRST)
========================= */
app.use("/api/users", user_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/network/interfaces", networkInterface_routes_1.default);
app.use("/api/network/general", networkGeneral_routes_1.default);
app.use("/api/network/bandwidth", globalBandwidth_routes_1.default);
app.use("/api/client/control", clientControl_routes_1.default);
app.use("/api/sub-vendo", subvendo_routes_1.default);
app.use("/api/network-engine", networkEngine_routes_1.default);
app.use("/api/network-status", networkStatus_routes_1.default);
app.use("/api/linux", linuxNetwork_routes_1.default);
app.use("/api/network", network_routes_1.default);
app.use("/api/network/interfaces", interface_routes_1.default);
app.use("/api/captive", captive_routes_1.default);
app.use("/api/vouchers", voucher_routes_1.default);
app.use("/api/packages", package_routes_1.default);
app.use("/api/machine", machine_routes_1.default);
app.use("/api/coin", coin_routes_1.default);
app.use("/api/payment", payment_routes_1.default);
app.use("/api/subvendo", subvendo_routes_1.default);
/* =========================
   STATIC FRONTEND
========================= */
app.use(express_1.default.static(CLIENT_BUILD_PATH));
/* =========================
   CAPTIVE PORTAL ROUTES
   (NO LOOP, NO REDIRECT CHAOS)
========================= */
// Android captive check
app.get("/generate_204", (_, res) => {
    res.redirect("/login");
});
// Windows connectivity test
app.get("/connecttest.txt", (_, res) => {
    res.redirect("/login");
});
// Apple captive check
app.get("/hotspot-detect.html", (_, res) => {
    res.redirect("/login");
});
// Main login route (SAFE)
app.get("/login", (_, res) => {
    const filePath = path_1.default.join(CLIENT_BUILD_PATH, "index.html");
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(500).json({
            success: false,
            message: "Frontend build missing (client/dist/index.html)",
        });
    }
    res.sendFile(filePath);
});
/* =========================
   ROOT ROUTE
========================= */
app.get("/", (_, res) => {
    const filePath = path_1.default.join(CLIENT_BUILD_PATH, "index.html");
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(500).json({
            success: false,
            message: "Frontend build missing (client/dist/index.html)",
        });
    }
    res.sendFile(filePath);
});
/* =========================
   SAFE FALLBACK (IMPORTANT)
   NO "*" route (Node 22 safe)
========================= */
app.use((req, res, next) => {
    if (req.path.startsWith("/api"))
        return next();
    return res.sendFile(path_1.default.join(CLIENT_BUILD_PATH, "index.html"));
});
/* =========================
   ERROR HANDLER
========================= */
app.use(error_middleware_1.errorHandler);
exports.default = app;
