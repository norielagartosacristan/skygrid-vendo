import express from "express";
import cors from "cors";




import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import networkGeneralRoutes from "./routes/networkGeneral.routes";
import globalBandwidthRoutes from "./routes/globalBandwidth.routes";
import clientControlRoutes from "./routes/clientControl.routes";
import networkInterfaceRoutes from "./routes/networkInterface.routes";
import subVendoRoutes from "./routes/subVendo.routes";
import networkEngineRoutes from "./routes/networkEngine.routes";
import networkStatusRoutes from "./routes/networkStatus.routes";
import linuxRoutes from "./routes/linuxNetwork.routes";
import networkRoutes from "./modules/network/routes/network.routes";
import interfaceRoutes from "./modules/network/routes/interface.routes";
import captiveRoutes from "./modules/captive/routes/captive.routes";
import voucherRoutes from "./modules/voucher/routes/voucher.routes";
import packageRoutes from "./modules/package/routes/package.routes";
import machineRoutes from "./modules/machine/routes/machine.routes";



const app = express();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/network/interfaces", networkInterfaceRoutes);
app.use("/api/network/general", networkGeneralRoutes);
app.use("/api/network/bandwidth", globalBandwidthRoutes);
app.use("/api/client/control", clientControlRoutes);
app.use("/api/network/interfaces", networkInterfaceRoutes);
app.use("/api/sub-vendo", subVendoRoutes);
app.use("/api/network-engine", networkEngineRoutes);
app.use("/api/network-status", networkStatusRoutes);
app.use("/api/linux", linuxRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/network/interfaces", interfaceRoutes);
app.use("/api/captive", captiveRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/machine", machineRoutes);



app.get("/", (_, res) => {
  res.json({
    message: "SkyGrid Vendo API Running 🚀",
  });
});

// LAGING HULI
app.use(errorHandler);

export default app;