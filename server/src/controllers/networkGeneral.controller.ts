import type { Request, Response } from "express";
import * as NetworkGeneralService from "../services/networkGeneral.service";

export async function getSettings(
  req: Request,
  res: Response
) {
  try {
    const settings = await NetworkGeneralService.getSettings();

    res.status(200).json(settings);

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
    const settings = await NetworkGeneralService.saveSettings(
      req.body
    );

    res.status(200).json({
      message: "Network settings saved successfully.",
      data: settings,
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message,
    });

  }
}