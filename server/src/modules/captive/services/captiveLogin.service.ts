import { voucherService } from "../../voucher/services/voucher.service";
import { ipsetService } from "../firewall/ipset.service";
import prisma from "../../../lib/prisma";

interface LoginRequest {

    voucher: string;

    clientIP: string;

}

class CaptiveLoginService {

    /**
     * Login Client
     */
    async login(data: LoginRequest) {

        const {

            voucher,

            clientIP

        } = data;

        /**
         * TODO
         * Check voucher database
         */

        const voucherData =
    await voucherService.redeem(voucher);

        if (!voucherData) {

            return {

                success: false,

                message: "Invalid voucher"

            };

        }

        /**
         * Allow Internet
         */

        await ipsetService.allow(clientIP);

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

        /**
         * TODO
         * Create Session
         */

        return {

            success: true,

            message: "Login Successful",

            ip: clientIP,

            voucher

        };

    }

    /**
     * Logout Client
     */

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