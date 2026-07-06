import express from "express";
import cors from "cors";
import path from "path";

import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
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
import { errorHandler } from "./middleware/error.middleware";

const app = express();

const CLIENT_BUILD_PATH = path.join(__dirname, "../client/dist");

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

/* =========================
   STATIC FRONTEND
========================= */

app.use(express.static(CLIENT_BUILD_PATH));

/* =========================
   CAPTIVE PORTAL ROUTES
   (NO LOOP, NO REDIRECT CHAOS)
========================= */

// Android captive check
app.get("/generate_204", (req, res) => {
  res.redirect("/login");
});

// Windows connectivity test
app.get("/connecttest.txt", (req, res) => {
  res.redirect("/login");
});

// Apple captive check
app.get("/hotspot-detect.html", (req, res) => {
  res.redirect("/login");
});

// Main login route (SAFE)
app.get("/login", (req, res) => {
  res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

/* =========================
   ROOT ROUTE
========================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
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