import { Request, Response } from "express";
import { ipsetService } from "../firewall/ipset.service";
import { firewallRules } from "../firewall/firewallRules.service";
import prisma from "../../../config/prisma";


export async function allow(
    req: Request,
    res: Response
) {

    try {

        const { ip } = req.body;

        if (!ip) {

            return res.status(400).json({
                message: "IP address is required"
            });

        }

        await ipsetService.allow(ip);

        res.json({
            success: true,
            message: `${ip} allowed`
        });

    } catch (err: any) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

export async function block(
    req: Request,
    res: Response
) {

    try {

        const { ip } = req.body;

        await ipsetService.block(ip);

        res.json({
            success: true,
            message: `${ip} blocked`
        });

    } catch (err: any) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

export async function clients(
    _req: Request,
    res: Response
) {

    try {

        const data =
            await ipsetService.list();

        res.send(data);

    } catch (err: any) {

        res.status(500).json({
            message: err.message
        });

    }

}

export async function getSession(req: Request, res: Response) {

    console.log("========== GET SESSION ==========");

    const ip = req.query.ip as string;

    console.log("IP:", ip);

    const session = await prisma.session.findFirst({
        where: {
            ipAddress: ip,
            isActive: true
        }
    });

    console.log(session);

    res.json(session);
}

export async function client(
    req: Request,
    res: Response
) {
    const ip =
        req.ip?.replace("::ffff:", "") ||
        req.socket.remoteAddress?.replace("::ffff:", "") ||
        "";

    res.json({ ip });
}




export async function enable(_req: Request, res: Response) {
    await firewallRules.initialize();

    res.json({
        success: true,
        message: "Captive Portal Enabled"
    });
}

export async function disable(_req: Request, res: Response) {
    // Mamaya natin lalagyan ng implementation
    res.json({
        success: true,
        message: "Captive Portal Disabled"
    });
}

export async function rules(_req: Request, res: Response) {
    const data = await firewallRules.showRules();

    res.send(data);
}