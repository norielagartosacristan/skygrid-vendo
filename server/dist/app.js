"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const package_routes_1 = __importDefault(require("./routes/package.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(error_middleware_1.errorHandler);
app.use("/api/users", user_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/packages", package_routes_1.default);
app.get("/", (_, res) => {
    res.json({
        message: "SkyGrid Vendo API Running 🚀",
    });
});
exports.default = app;
