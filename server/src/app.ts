import express from "express";
import cors from "cors";

import packageRoutes from "./routes/package.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import networkGeneralRoutes from "./routes/network-general.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use(
  "/api/network/general",
  networkGeneralRoutes
);

app.get("/", (_, res) => {
  res.json({
    message: "SkyGrid Vendo API Running 🚀",
  });
});

// LAGING HULI
app.use(errorHandler);

export default app;