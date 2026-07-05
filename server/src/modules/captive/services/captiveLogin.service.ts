import { voucherService } from "../../voucher/services/voucher.service";
import { ipsetService } from "../firewall/ipset.service";
import prisma from "../../../config/prisma";
import { sessionService } from "../session/session.service";
import { convertToMinutes } from "../../../utils/time";
import { machineService } from "../../machine/services/machine.service";

class CaptiveLoginService {

    async login(data: { voucher: string; clientIP: string }) {

        const { voucher, clientIP } = data;

        // 1. Validate voucher
        const voucherData =
            await voucherService.redeem(voucher);

        // 2. Allow internet
        await ipsetService.allow(clientIP);

        // 3. Create session
        const machineId = machineService.getMachineId();

console.log("Machine ID:", machineId);

const machine = await prisma.machine.findUnique({
    where: {
        id: machineId
    }
});

console.log("Machine:", machine);

await sessionService.createSession(
    machineId,
    voucherData.id,
    clientIP,
    clientIP,
    convertToMinutes(
        voucherData.package.duration,
        voucherData.package.durationUnit
    )
);

        // 4. Mark voucher as used
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

        return {
            success: true,
            message: "Login Successful",
            ip: clientIP,
            voucher
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