import { Request, Response } from "express";
import { bridgeService } from "./bridges.service";

export async function list(
    req: Request,
    res: Response
) {
    const data = await bridgeService.list();

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
        await bridgeService.create(req.body);

    res.json({
        success: true,
        data
    });
}

export async function remove(
    req: Request,
    res: Response
) {
    await bridgeService.remove(req.params.id);

    res.json({
        success: true
    });
}