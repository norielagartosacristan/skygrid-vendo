import { ipsetService } from "../firewall/ipset.service";

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

        const validVoucher =
            await this.validateVoucher(voucher);

        if (!validVoucher) {

            return {

                success: false,

                message: "Invalid voucher"

            };

        }

        /**
         * Allow Internet
         */

        await ipsetService.allow(clientIP);

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

    /**
     * Temporary Voucher Validation
     */

    private async validateVoucher(
        voucher: string
    ): Promise<boolean> {

        /**
         * TEMP ONLY
         */

        return voucher === "SKYGRID123";

    }

}

export const captiveLoginService =
    new CaptiveLoginService();