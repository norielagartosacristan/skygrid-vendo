import { Request, Response } from "express";
import { ipsetService } from "../firewall/ipset.service";
import { firewallRules } from "../firewall/firewallRules.service";

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
    req: Request,
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

export async function clear(
    req: Request,
    res: Response
) {

    try {

        await ipsetService.clear();

        res.json({
            success: true
        });

    } catch (err: any) {

        res.status(500).json({
            message: err.message
        });

    }

}


export async function enable(req: Request, res: Response) {
    await firewallRules.initialize();

    res.json({
        success: true,
        message: "Captive Portal Enabled"
    });
}

export async function disable(req: Request, res: Response) {
    // Mamaya natin lalagyan ng implementation
    res.json({
        success: true,
        message: "Captive Portal Disabled"
    });
}

export async function rules(req: Request, res: Response) {
    const data = await firewallRules.showRules();

    res.send(data);
}