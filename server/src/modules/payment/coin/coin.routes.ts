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
 * Portal -> Cancel coin session
 */
router.post(
    "/cancel",
    coinController.cancelClient.bind(
        coinController
    )
);

/**
 * ESP8266 -> Check waiting client
 */
router.get(
    "/waiting/:chipId",
    coinController.waiting
);

/**
 * ESP8266 -> Coin Inserted
 */
router.post(
    "/insert",
    coinController.insert
);

export default router;