import { Router } from "express";
import { packageController } from "../controllers/package.controller";

const router = Router();

router.get(
    "/",
    packageController.getAll.bind(packageController)
);

export default router;