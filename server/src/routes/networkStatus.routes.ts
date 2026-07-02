import { Router } from "express";
import * as Controller from "../controllers/networkStatus.controller";

const router = Router();

router.get("/", Controller.status);

export default router;