import { Router } from "express";

import * as Controller from "../controllers/network.controller";

const router=Router();

router.get(
"/vlans",
Controller.getVlans
);

router.post(
"/vlans",
Controller.createVlan
);

export default router;