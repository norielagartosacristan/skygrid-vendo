import { Router } from "express";
import * as CaptiveController from "../controllers/captive.controller";
import * as LoginController from "../controllers/login.controller";

const router = Router();

router.post("/login", LoginController.login);

/**
 * Firewall
 */
router.post("/enable", CaptiveController.enable);

router.post("/disable", CaptiveController.disable);

router.get("/rules", CaptiveController.rules);

/**
 * Client Authentication
 */
router.post("/allow", CaptiveController.allow);

router.post("/block", CaptiveController.block);

router.get("/clients", CaptiveController.clients);

router.delete("/clients", CaptiveController.clear);

export default router;