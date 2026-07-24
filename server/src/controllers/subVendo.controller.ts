import { Request, Response } from "express";
import * as SubVendoService from "../services/subVendo.service";
import prisma from "../config/prisma";



export async function register(req: Request, res: Response) {
  try {
    console.log("BODY:", req.body);

    const device = await SubVendoService.registerDevice(req.body);

    res.json({
      message: "Device registered successfully.",
      data: device,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to register device.",
    });
  }
}


export async function pending(_req: Request, res: Response) {
  try {
    const devices = await SubVendoService.getPendingDevices();

    res.json(devices);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to load devices.",
    });
  }
}

export async function configure(
    req: Request,
    res: Response
) {
    try {

        const chipId =
            req.params.chipId as string;

        if (!chipId) {
            return res.status(400).json({
                message:
                    "Chip ID is required.",
            });
        }

        console.log(
            "CONFIGURE SUBVENDO:",
            chipId
        );

        const existing =
            await prisma.subVendo.findUnique({
                where: {
                    chipId,
                },
            });

        if (!existing) {
            return res.status(404).json({
                message:
                    "SubVendo not found.",
            });
        }

        const device =
            await SubVendoService.configureDevice(
                existing.id,
                req.body
            );

        res.json({
            message:
                "SubVendo configured successfully.",

            data:
                device,
        });

    } catch (err) {

        console.error(
            "CONFIGURE SUBVENDO ERROR:",
            err
        );

        res.status(500).json({
            message:
                "Unable to configure SubVendo.",
        });

    }
}

export async function registered(req: Request, res: Response) {
  try {
    const devices = await SubVendoService.getRegisteredDevices();

    res.json(devices);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to load registered devices.",
    });
  }
}

export async function heartbeat(
  req: Request,
  res: Response
) {
  try {

    const {
      chipId,
      uptime,
      connectedClients,
      freeMemory,
      wifiSignal,
      temperature,
    } = req.body;

    const device = await SubVendoService.heartbeat(
      chipId,
      {
        uptime,
        connectedClients,
        freeMemory,
        wifiSignal,
        temperature,
      }
    );

    res.json(device);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Heartbeat failed.",
    });

  }
}

export async function configuration(
  req: Request,
  res: Response
) {
  try {

    const config =
      await SubVendoService.getConfiguration(
        req.params.chipId as string
      );

    if (!config) {
      return res.status(404).json({
        message: "Device not found.",
      });
    }

    res.json(config);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Unable to load configuration.",
    });

  }
}

export async function testCoin(req: Request, res: Response) {

    const chipId = req.params.chipId;

    const pulses = Number(req.body.pulses ?? 1);

    console.log("TEST COIN:", chipId, pulses);

    // tawagin ang parehong function na ginagamit ng coinService
    // halimbawa:
    // await CoinService.coinInserted(chipId, pulses);

    res.json({
        success: true
    });
}

export async function wait(req: Request, res: Response) {

    const {
        machineId,
        clientIP,
        clientMac
    } = req.body;

    await prisma.waitingClient.deleteMany({
        where: {
            clientIP
        }
    });

    const waiting =
        await prisma.waitingClient.create({

            data: {

                machineId,
                clientIP,
                clientMac

            }

        });

    res.json(waiting);

}

