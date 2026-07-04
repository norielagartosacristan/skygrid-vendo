import { voucherService } from "../../voucher/services/voucher.service";
import { ipsetService } from "../firewall/ipset.service";
import prisma from "../../../config/prisma";
import { sessionService } from "../session/session.service";
import { convertToMinutes } from "../../../utils/time";

class CaptiveLoginService {

    async login(data: { voucher: string; clientIP: string }) {

        const { voucher, clientIP } = data;

        // 1. Validate voucher
        const voucherData =
            await voucherService.redeem(voucher);

        // 2. Allow internet
        await ipsetService.allow(clientIP);

        // 3. Create session
        await sessionService.createSession(
            voucherData.id,
            clientIP,
            convertToMinutes(
                voucherData.duration,
                voucherData.durationUnit
            )
        );

        // 4. Mark voucher as used
        await prisma.package.update({
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