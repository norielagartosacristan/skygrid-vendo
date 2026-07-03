import { Request, Response } from "express";
import { networkMonitor } from "../services/networkMonitor.service";

export async function getStatus(
    req: Request,
    res: Response
){

    res.json(
        networkMonitor.getData()
    );

}