import { Router } from "express";
import { machineController } from "../controllers/machine.controller";

const router = Router();

router.get(
    "/",
    machineController.info.bind(machineController)
);

router.post(
    "/register",
    machineController.register.bind(machineController)
);

export default router;