import { Router } from "express";
import * as ClientControlController from "../controllers/clientControl.controller";

const router = Router();

router.get("/", ClientControlController.getSettings);

router.post("/", ClientControlController.saveSettings);

export default router;