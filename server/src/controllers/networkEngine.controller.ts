import { Request, Response } from "express";
import * as NetworkEngine from "../services/networkEngine.service";

export function detect(req: Request, res: Response) {
  res.json(NetworkEngine.detectInterfaces());
}