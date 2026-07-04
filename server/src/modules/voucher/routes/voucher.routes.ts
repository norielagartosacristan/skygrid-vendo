import { Router } from "express";
import { voucherController } from "../controllers/voucher.controller";

const router = Router();

router.post(
    "/generate",
    voucherController.generate
);

export default router;