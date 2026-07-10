import { voucherService } from "../../voucher/services/voucher.service";
import { ipsetService } from "../firewall/ipset.service";
import prisma from "../../../config/prisma";
import { sessionService } from "../session/session.service";
import { convertToMinutes } from "../../../utils/time";
import { machineService } from "../../machine/services/machine.service";

class CaptiveLoginService {

    async login(data: { voucher: string; clientIP: string }) {

    const { voucher, clientIP } = data;

    console.log("========== LOGIN START ==========");
    console.log("Voucher:", voucher);
    console.log("Client:", clientIP);

    // 1
    const voucherData = await voucherService.redeem(voucher);

    console.log("Voucher OK");
    console.log(voucherData);

    // 2
    console.log("Adding IP to ipset...");
    await ipsetService.allow(clientIP);
    console.log("IPSET DONE");

    // 3
    const machine = await machineService.getCurrentMachine();

if (!machine) {
    throw new Error("Machine not registered.");
}

    const machineId = machine.id;
    console.log("Machine:", machine);
    console.log("Machine ID:", machineId);
    
    console.log("Creating session...");

    const session = await sessionService.createSession(
        machineId,
        voucherData.package.id,
        clientIP,
        clientIP,
        convertToMinutes(
            voucherData.package.duration,
            voucherData.package.durationUnit
        )
    );

    console.log("Session Created");
    console.log(session);

    // 4
    console.log("Updating voucher...");

    await prisma.voucher.update({
        where: {
            id: voucherData.id
        },
        data: {
            status: "USED",
            usedByIP: clientIP,
            usedAt: new Date()
        }
    });

    console.log("Voucher Updated");

    console.log("========== LOGIN SUCCESS ==========");

    return {
    success: true,
    message: "Login Successful",
    session
};
}

    async logout(clientIP: string) {

        await ipsetService.block(clientIP);

        return {
            success: true,
            message: "Logged Out"
        };
    }
}

export const captiveLoginService =
    new CaptiveLoginService();