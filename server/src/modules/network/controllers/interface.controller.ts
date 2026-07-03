import { Request, Response } from "express";
import * as InterfaceService from "../services/interface.service";

export async function getInterfaces(
  req: Request,
  res: Response
) {
  try {
    const data = await InterfaceService.getInterfaces();

    res.json(data);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
}