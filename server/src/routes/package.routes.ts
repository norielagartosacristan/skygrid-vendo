import { Router } from "express";
import * as PackageController from "../controllers/package.controller";

const router = Router();

router.get("/", PackageController.getPackages);

export default router;