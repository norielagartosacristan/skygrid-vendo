import type { Request, Response } from "express";
import * as NetworkInterfaceService from "../services/networkInterface.service";

export async function getInterfaces(
  req: Request,
  res: Response
) {
  try {
    const interfaces =
      await NetworkInterfaceService.getInterfaces();

    res.json(interfaces);

  } catch (error: any) {

    res.status(500).json({
      message: error.message,
    });

  }
}

export async function getInterface(
  req: Request,
  res: Response
) {
  try {

    const { id } = req.params;

    const networkInterface =
      await NetworkInterfaceService.getInterface(id);

    if (!networkInterface) {
      return res.status(404).json({
        message: "Interface not found.",
      });
    }

    res.json(networkInterface);

  } catch (error: any) {

    res.status(500).json({
      message: error.message,
    });

  }
}

export async function createInterface(
  req: Request,
  res: Response
) {
  try {

    const networkInterface =
      await NetworkInterfaceService.createInterface(
        req.body
      );

    res.status(201).json({
      message: "Interface created successfully.",
      data: networkInterface,
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message,
    });

  }
}

export async function updateInterface(
  req: Request,
  res: Response
) {
  try {

    const { id } = req.params;

    const networkInterface =
      await NetworkInterfaceService.updateInterface(
        id,
        req.body
      );

    res.json({
      message: "Interface updated successfully.",
      data: networkInterface,
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message,
    });

  }
}

export async function deleteInterface(
  req: Request,
  res: Response
) {
  try {

    const { id } = req.params;

    await NetworkInterfaceService.deleteInterface(id);

    res.json({
      message: "Interface deleted successfully.",
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message,
    });

  }
}