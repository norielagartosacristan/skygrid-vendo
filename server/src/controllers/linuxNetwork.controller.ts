import { Request, Response } from "express";
import * as Linux from "../services/linuxNetwork.service";

export async function interfaces(
  req: Request,
  res: Response
) {
  const list = await Linux.listInterfaces();

  res.json(list);
}