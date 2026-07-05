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

       const forwarded = req.headers["x-forwarded-for"];
const remote = req.socket.remoteAddress;
const reqIp = req.ip;

console.log("=================================");
console.log("req.ip:", reqIp);
console.log("remoteAddress:", remote);
console.log("x-forwarded-for:", forwarded);
console.log("=================================");

const clientIP = normalizeIP(
    (Array.isArray(forwarded) ? forwarded[0] : forwarded) ||
    remote ||
    ""
);

console.log("Resolved Client IP:", clientIP);
        console.log("req.ip =", req.ip);
console.log("remoteAddress =", req.socket.remoteAddress);
console.log("headers =", req.headers["x-forwarded-for"]);
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