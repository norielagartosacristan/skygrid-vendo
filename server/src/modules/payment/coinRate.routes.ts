import {
  Router
} from "express";

import {
  getCoinRates
} from "./coinRate.controller";

const router =
  Router();

router.get(
  "/",
  getCoinRates
);

export default router;