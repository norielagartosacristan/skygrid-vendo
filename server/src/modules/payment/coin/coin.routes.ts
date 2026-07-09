import { Router } from "express";
import { coinController } from "./coin.controller";

const router = Router();

router.post(
    "/insert",
    coinController.insert
);

export default router;