import { Request, Response } from "express";
import { vlanService } from "./vlans.service";

export async function list(
    req: Request,
    res: Response
) {
    const data =
        await vlanService.list();

    res.json({
        success: true,
        data
    });
}

export async function create(
    req: Request,
    res: Response
) {
    const data =
        await vlanService.create(req.body);

    res.json({
        success: true,
        data
    });
}

export async function remove(
    req: Request,
    res: Response
) {
    await vlanService.remove(req.params.id);

    res.json({
        success: true
    });
}