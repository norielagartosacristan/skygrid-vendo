import { Request, Response } from "express";
import { machineService } from "../services/machine.service";

class MachineController {

    async info(req: Request, res: Response) {

        try {

            const machine = await machineService.getCurrentMachine();

            return res.json({
                success: true,
                data: machine
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async register(req: Request, res: Response) {

        try {

            const machine =
                await machineService.register();

            return res.json({
                success: true,
                data: machine
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

}

export const machineController =
    new MachineController();