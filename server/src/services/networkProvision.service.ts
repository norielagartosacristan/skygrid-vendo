import prisma from "../config/prisma";
import { detectInterfaces } from "./networkEngine.service";

export async function autoProvision() {
  const interfaces = detectInterfaces();

  for (const item of interfaces) {
    const existing = await prisma.networkInterface.findFirst({
      where: {
        name: item.name,
      },
    });

    if (existing) continue;

    await prisma.networkInterface.create({
      data: {
        name: item.name,
        displayName: "Internet",

        role: "WAN",

        type: "ETHERNET",

        enabled: true,

        ipMode: "DHCP",

        ipAddress: item.ipAddress,

        subnetMask: item.subnetMask,
      },
    });

    console.log("Imported:", item.name);
  }
}