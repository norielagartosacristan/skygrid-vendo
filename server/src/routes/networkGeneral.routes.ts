import { Router } from "express";
import * as NetworkGeneralController from "../controllers/networkGeneral.controller";

const router = Router();

router.get(
  "/",
  NetworkGeneralController.getSettings
);

router.post(
  "/",
  NetworkGeneralController.saveSettings
);

export default router;