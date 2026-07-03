import { Router } from "express";
import * as Controller from "../controllers/interface.controller";

const router = Router();

router.get("/", Controller.getInterfaces);

export default router;