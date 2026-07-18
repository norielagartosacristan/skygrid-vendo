import { Request, Response } from "express";
import * as NetworkService from "../services/network.service";

export async function getVlans(
    _req:Request,
    res:Response
){

    const data=await NetworkService.getVlans();

    res.json(data);

}

export async function createVlan(
    req:Request,
    res:Response
){

    const vlan=await NetworkService.createVlan(
        req.body
    );

    res.json(vlan);

}

