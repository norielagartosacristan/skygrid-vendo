import express from "express";
import cors from "cors";

import packageRoutes from "./routes/package.routes";
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





const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/network/interfaces", networkInterfaceRoutes);
app.use("/api/network/general", networkGeneralRoutes);
app.use("/api/network/bandwidth", globalBandwidthRoutes);
app.use("/api/client/control", clientControlRoutes);
app.use("/api/network/interfaces", networkInterfaceRoutes);
app.use("/api/sub-vendo", subVendoRoutes);
app.use("/api/network-engine", networkEngineRoutes);
app.use("/api/network-status", networkStatusRoutes);
app.use("/api/linux", linuxRoutes);


app.get("/", (_, res) => {
  res.json({
    message: "SkyGrid Vendo API Running 🚀",
  });
});

// LAGING HULI
app.use(errorHandler);

export default app;