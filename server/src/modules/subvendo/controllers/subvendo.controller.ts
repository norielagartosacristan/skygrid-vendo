import { Request, Response } from "express";
import { subVendoService } from "../services/subvendo.service";

export async function register(req: Request, res: Response) {

    console.log("================================");
    console.log("REGISTER REQUEST");
    console.log(req.body);
    console.log("================================");

    try {

        const machine = await subVendoService.register(req.body);

        console.log("REGISTER SUCCESS");

        res.json({
            success: true,
            machine
        });

    } catch (err: any) {

        console.error("REGISTER ERROR");
        console.error(err);

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

export async function registered(
    req: Request,
    res: Response
) {

    try {

        const devices =
            await subVendoService.registered();

        res.json(devices);

    } catch (err: any) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

}

export async function update(
    req: Request<{ id: string }>,
    res: Response
) {
    try {

        const device =
            await subVendoService.update(
                req.params.id,
                req.body
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

export async function coin(
    req: Request,
    res: Response
)
{
    try
    {
        const result =
            await subVendoService.coin(req.body);

        res.json(result);
    }
    catch(err: any)
    {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
