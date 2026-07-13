import { Router } from "express";

import * as controller
    from "../controllers/subvendo.controller";

const router = Router();

router.post(
    "/register",
    controller.register
);

router.post(
    "/heartbeat",
    controller.heartbeat
);

router.get(
    "/config/:chipId",
    controller.config
);

router.post(
    "/:id/approve",
    controller.approve
);

export default router;