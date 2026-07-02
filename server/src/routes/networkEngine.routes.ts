import { Router } from "express";
import * as Controller from "../controllers/networkEngine.controller";

const router = Router();

router.get("/detect", Controller.detect);

export default router;