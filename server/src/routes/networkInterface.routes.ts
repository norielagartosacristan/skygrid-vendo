import { Router } from "express";
import * as NetworkInterfaceController from "../controllers/networkInterface.controller";

const router = Router();

// Get all interfaces
router.get(
  "/",
  NetworkInterfaceController.getInterfaces
);

router.get(
    "/assignable",
    networkInterfaceController.getAssignableInterfaces
);

// Get single interface
router.get(
  "/:id",
  NetworkInterfaceController.getInterface
);

// Create interface
router.post(
  "/",
  NetworkInterfaceController.createInterface
);

// Update interface
router.put(
  "/:id",
  NetworkInterfaceController.updateInterface
);

// Delete interface
router.delete(
  "/:id",
  NetworkInterfaceController.deleteInterface
);

export default router;