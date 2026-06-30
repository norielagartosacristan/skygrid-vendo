import { Request, Response } from "express";
import * as PackageService from "../services/package.service";

export async function getPackages(
  req: Request,
  res: Response
) {
  try {
    const packages = await PackageService.getPackages();

    res.json(packages);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}