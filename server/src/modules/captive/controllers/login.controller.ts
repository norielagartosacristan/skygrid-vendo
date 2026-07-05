import { Request, Response } from "express";
import { captiveLoginService } from "../services/captiveLogin.service";

function normalizeIP(ip: string): string {

    if (ip === "::1") {
        return "127.0.0.1";
    }

    return ip.replace(/^::ffff:/, "");
}

export async function login(
    req: Request,
    res: Response
) {
    try {

        const { voucher } = req.body;

        const clientIP =
    normalizeIP(
        req.headers["x-forwarded-for"] as string ||
        req.socket.remoteAddress ||
        ""
    );

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