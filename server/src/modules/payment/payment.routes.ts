import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
    "/process",
    paymentController.process
);

export default router;