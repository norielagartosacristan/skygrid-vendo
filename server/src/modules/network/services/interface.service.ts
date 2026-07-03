import { exec } from "child_process";
import { promisify } from "util";
import prisma from "../../../config/prisma";

const execAsync = promisify(exec);

export async function getInterfaces() {

    const { stdout } = await execAsync("ip -j addr show");

    const linuxInterfaces = JSON.parse(stdout);

    const dbInterfaces = await prisma.networkInterface.findMany();

    return linuxInterfaces.map((iface: any) => {

        const db = dbInterfaces.find(
            (i) => i.name === iface.ifname
        );

        const ipv4 = iface.addr_info?.find(
            (a: any) => a.family === "inet"
        );

        return {

            id: db?.id,

            displayName:
                db?.displayName ||
                iface.ifname,

            name: iface.ifname,

            role:
                db?.role || "-",

            type:
                db?.type ||
                (iface.ifname.includes(".")
                    ? "VLAN"
                    : "Physical"),

            ipAddress:
                ipv4?.local || "",

            macAddress:
                iface.address,

            status:
                iface.operstate,

            enabled:
                iface.operstate === "UP",

            prefix:
                ipv4?.prefixlen,

            gateway:
                db?.gateway || "",

        };

    });

}