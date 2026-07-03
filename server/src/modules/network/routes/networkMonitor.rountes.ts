import { Router } from "express";
import { getStatus } from "../controllers/networkMonitor.controller";

const router = Router();

router.get(
    "/status",
    getStatus
);

export default router;