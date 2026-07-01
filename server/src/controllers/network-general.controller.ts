import { Request, Response } from "express";
import * as Service from "../services/network-general.service";

export async function getSettings(
  req: Request,
  res: Response
) {
  const settings = await Service.getSettings();

  res.json(settings);
}

export async function saveSettings(
  req: Request,
  res: Response
) {
  const settings = await Service.saveSettings(
    req.body
  );

  res.json(settings);
}