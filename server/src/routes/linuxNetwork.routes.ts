import { Router } from "express";
import * as Controller from "../controllers/linuxNetwork.controller";

const router = Router();

router.get("/interfaces", Controller.interfaces);

export default router;