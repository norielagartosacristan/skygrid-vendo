import { Request, Response } from "express";
import { networkMonitor } from "../services/networkMonitor.service";

export async function getStatus(
    _req: Request,
    res: Response
){

    res.json(
        networkMonitor.getData()
    );

}