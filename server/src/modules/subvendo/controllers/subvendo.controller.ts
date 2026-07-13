import { Request, Response } from "express";
import { subVendoService } from "../services/subvendo.service";

export async function register(req: Request, res: Response) {

    try {

        const machine =
            await subVendoService.register(req.body);

        res.json({

            success: true,

            machine

        });

    } catch (err: any) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

}

export async function heartbeat(req: Request, res: Response) {

    try {

        await subVendoService.heartbeat(req.body);

        res.json({

            success: true

        });

    } catch (err: any) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

}

export async function config(
    req: Request<{ chipId: string }>,
    res: Response
) {

    const machine =
        await subVendoService.getConfig(
            req.params.chipId
        );

    res.json(machine);

}

export async function approve(
    req: Request<{ id: string }>,
    res: Response
) {

    try {

        const device =
            await subVendoService.approve(
                req.params.id
            );

        res.json({

            success: true,

            device

        });

    } catch (err: any) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

}

export async function pending(
    req: Request,
    res: Response
) {

    try {

        const devices =
            await subVendoService.pending();

        res.json(devices);

    } catch (err: any) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

}