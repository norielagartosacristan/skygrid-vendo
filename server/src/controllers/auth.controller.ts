import type { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

export async function login(
    req: Request,
    res: Response
) {
      console.log("BODY:", req.body); // ← ilagay dito

    try {

        const { email, password } = req.body;

        const result = await AuthService.login(
            email,
            password
        );

        res.json(result);

    } catch (err: any) {

        res.status(401).json({
            message: err.message,
        });

    }

}