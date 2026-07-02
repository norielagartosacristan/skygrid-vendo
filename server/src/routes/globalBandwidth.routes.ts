import { Router } from "express";
import * as GlobalBandwidthController from "../controllers/globalBandwidth.controller";

const router = Router();

router.get(
  "/",
  GlobalBandwidthController.getSettings
);

router.post(
  "/",
  GlobalBandwidthController.saveSettings
);

export default router;