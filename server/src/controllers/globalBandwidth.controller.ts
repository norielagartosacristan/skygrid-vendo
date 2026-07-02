import type { Request, Response } from "express";
import * as GlobalBandwidthService from "../services/globalBandwidth";

export async function getSettings(
  req: Request,
  res: Response
) {
  try {
    const settings =
      await GlobalBandwidthService.getSettings();

    res.json(settings);

  } catch (error: any) {

    res.status(500).json({
      message: error.message,
    });

  }
}

export async function saveSettings(
  req: Request,
  res: Response
) {
  try {

    const settings =
      await GlobalBandwidthService.saveSettings(
        req.body
      );

    res.json({
      message: "Bandwidth settings saved successfully.",
      data: settings,
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message,
    });

  }
}