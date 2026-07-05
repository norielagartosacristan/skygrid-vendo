import { Request, Response } from "express";
import { packageService } from "../services/package.service";

class PackageController {

    async getAll(req: Request, res: Response) {

        try {

            const packages =
                await packageService.getAll();

            return res.json({

                success: true,

                data: packages

            });

        }

        catch (error: any) {

            return res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

}

export const packageController =
    new PackageController();