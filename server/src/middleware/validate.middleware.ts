import { Request, Response, NextFunction } from "express";

export function validate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
}