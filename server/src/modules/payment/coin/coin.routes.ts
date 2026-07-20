import { Router } from "express";
import { coinController } from "./coin.controller";

const router = Router();

/**
 * Portal -> Waiting for Coin
 */
router.post(
    "/wait",
    coinController.wait
);

/**
 * ESP8266 -> Coin Inserted
 */
router.post(
    "/insert",
    coinController.insert
);

export default router;