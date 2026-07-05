import { Router } from "express";
import { voucherController } from "../controllers/voucher.controller";

const router = Router();

router.get(
    "/",
    voucherController.getAll.bind(voucherController)
);

router.post(
    "/generate",
    voucherController.generate.bind(voucherController)
);

export default router;