import { Router } from "express";
import * as SubVendoController from "../controllers/subVendo.controller";

const router = Router();

// Register new device
router.post(
  "/register",
  SubVendoController.register
);

// Get all pending devices
router.get(
  "/pending",
  SubVendoController.pending
);

// Configure device
router.put(
  "/:id",
  SubVendoController.configure
);

// Get registered devices
router.get(
  "/registered",
  SubVendoController.registered
);

router.post(
    "/heartbeat",
    SubVendoController.heartbeat
);

router.get(
    "/configuration/:chipId",
    SubVendoController.configuration
);

router.get(
  "/config/:chipId",
  SubVendoController.configuration
);

router.post(
    "/:chipId/test-coin",
    SubVendoController.testCoin
);

export default router;