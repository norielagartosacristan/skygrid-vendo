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

router.get(
    "/pending",
    controller.pending
);

router.get(
    "/registered",
    controller.registered
);

router.put(
    "/:id",
    controller.update
);

export default router;