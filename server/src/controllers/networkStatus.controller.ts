import { Request, Response } from "express";
import * as Service from "../services/networkStatus.service";

export function status(req: Request, res: Response) {
  res.json(Service.getStatus());
}