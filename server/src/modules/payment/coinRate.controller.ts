import { Request, Response } from "express";
import prisma from "../../config/prisma";

export async function getCoinRates(
  req: Request,
  res: Response
) {
  try {

    const rates =
      await prisma.coinRate.findMany({

        where: {
          enabled: true
        },

        orderBy: {
          amount: "asc"
        }

      });

    return res.json({

      success: true,

      rates

    });

  } catch (error: any) {

    console.error(
      "[GET COIN RATES ERROR]",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to load coin rates."

    });

  }
}