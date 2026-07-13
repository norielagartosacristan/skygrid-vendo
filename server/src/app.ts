import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import networkGeneralRoutes from "./routes/networkGeneral.routes";
import globalBandwidthRoutes from "./routes/globalBandwidth.routes";
import clientControlRoutes from "./routes/clientControl.routes";
import networkInterfaceRoutes from "./routes/networkInterface.routes";
import networkEngineRoutes from "./routes/networkEngine.routes";
import networkStatusRoutes from "./routes/networkStatus.routes";
import linuxRoutes from "./routes/linuxNetwork.routes";
import networkRoutes from "./modules/network/routes/network.routes";
import interfaceRoutes from "./modules/network/routes/interface.routes";
import captiveRoutes from "./modules/captive/routes/captive.routes";
import voucherRoutes from "./modules/voucher/routes/voucher.routes";
import packageRoutes from "./modules/package/routes/package.routes";
import machineRoutes from "./modules/machine/routes/machine.routes";
import { errorHandler } from "./middleware/error.middleware";
import coinRoutes from "./modules/payment/coin/coin.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import subVendoRoutes from "./modules/subvendo/routes/subvendo.routes";


const app = express();



const CLIENT_BUILD_PATH = path.resolve(
  process.cwd(),
  "client/dist"
);

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());

/* =========================
   API ROUTES (ALWAYS FIRST)
========================= */

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/network/interfaces", networkInterfaceRoutes);
app.use("/api/network/general", networkGeneralRoutes);
app.use("/api/network/bandwidth", globalBandwidthRoutes);
app.use("/api/client/control", clientControlRoutes);
app.use("/api/network-engine", networkEngineRoutes);
app.use("/api/network-status", networkStatusRoutes);
app.use("/api/linux", linuxRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/network/interfaces", interfaceRoutes);
app.use("/api/captive", captiveRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/machine", machineRoutes);
app.use("/api/coin", coinRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/subvendo", subVendoRoutes);

/* =========================
   STATIC FRONTEND
========================= */

app.use(express.static(CLIENT_BUILD_PATH));

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
  const filePath = path.join(CLIENT_BUILD_PATH, "index.html");

  if (!fs.existsSync(filePath)) {
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
  const filePath = path.join(CLIENT_BUILD_PATH, "index.html");

  if (!fs.existsSync(filePath)) {
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
  if (req.path.startsWith("/api")) return next();
  return res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

/* =========================
   ERROR HANDLER
========================= */

app.use(errorHandler);

export default app;