import type { Request, Response } from "express";
import * as ClientControlService from "../services/clientControl";

export async function getSettings(
  req: Request,
  res: Response
) {
  try {
    const settings =
      await ClientControlService.getSettings();

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
      await ClientControlService.saveSettings(
        req.body
      );

    res.json({
      message: "Client Control saved successfully.",
      data: settings,
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message,
    });

  }
}