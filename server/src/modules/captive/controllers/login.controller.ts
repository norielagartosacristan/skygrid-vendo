import { Request, Response } from "express";
import { captiveLoginService } from "../services/captiveLogin.service";

function normalizeIP(ip: string): string {
    return ip.replace(/^::ffff:/, "");
}

export async function login(
    req: Request,
    res: Response
) {
    try {

        const { voucher } = req.body;

        const clientIP = normalizeIP(req.ip || "");

        const result = await captiveLoginService.login({
            voucher,
            clientIP,
        });

        res.json(result);

    } catch (err: any) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }
}