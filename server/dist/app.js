"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const networkGeneral_routes_1 = __importDefault(require("./routes/networkGeneral.routes"));
const globalBandwidth_routes_1 = __importDefault(require("./routes/globalBandwidth.routes"));
const clientControl_routes_1 = __importDefault(require("./routes/clientControl.routes"));
const networkInterface_routes_1 = __importDefault(require("./routes/networkInterface.routes"));
const subVendo_routes_1 = __importDefault(require("./routes/subVendo.routes"));
const networkEngine_routes_1 = __importDefault(require("./routes/networkEngine.routes"));
const networkStatus_routes_1 = __importDefault(require("./routes/networkStatus.routes"));
const linuxNetwork_routes_1 = __importDefault(require("./routes/linuxNetwork.routes"));
const network_routes_1 = __importDefault(require("./modules/network/routes/network.routes"));
const interface_routes_1 = __importDefault(require("./modules/network/routes/interface.routes"));
const captive_routes_1 = __importDefault(require("./modules/captive/routes/captive.routes"));
const voucher_routes_1 = __importDefault(require("./modules/voucher/routes/voucher.routes"));
const package_routes_1 = __importDefault(require("./modules/package/routes/package.routes"));
const machine_routes_1 = __importDefault(require("./modules/machine/routes/machine.routes"));
const app = (0, express_1.default)();
app.set("trust proxy", true);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/users", user_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/network/interfaces", networkInterface_routes_1.default);
app.use("/api/network/general", networkGeneral_routes_1.default);
app.use("/api/network/bandwidth", globalBandwidth_routes_1.default);
app.use("/api/client/control", clientControl_routes_1.default);
app.use("/api/network/interfaces", networkInterface_routes_1.default);
app.use("/api/sub-vendo", subVendo_routes_1.default);
app.use("/api/network-engine", networkEngine_routes_1.default);
app.use("/api/network-status", networkStatus_routes_1.default);
app.use("/api/linux", linuxNetwork_routes_1.default);
app.use("/api/network", network_routes_1.default);
app.use("/api/network/interfaces", interface_routes_1.default);
app.use("/api/captive", captive_routes_1.default);
app.use("/api/vouchers", voucher_routes_1.default);
app.use("/api/packages", package_routes_1.default);
app.use("/api/machine", machine_routes_1.default);
app.get("/", (_, res) => {
    res.json({
        message: "SkyGrid Vendo API Running 🚀",
    });
});
// LAGING HULI
app.use(error_middleware_1.errorHandler);
exports.default = app;
