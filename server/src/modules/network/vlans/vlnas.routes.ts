import { Router } from "express";

import {
    list,
    create,
    remove
} from "./vlans.controller";

const router = Router();

router.get("/", list);

router.post("/", create);

router.delete("/:id", remove);

export default router;