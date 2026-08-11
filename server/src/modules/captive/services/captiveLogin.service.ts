import { voucherService } from "../../voucher/services/voucher.service";
import { ipsetService } from "../firewall/ipset.service";
import prisma from "../../../config/prisma";
import { sessionService } from "../session/session.service";
import { convertToMinutes } from "../../../utils/time";
import { machineService } from "../../machine/services/machine.service";
import { macService } from "../network/mac.service";

class CaptiveLoginService {

    async login(data: {
        voucher: string;
        clientIP: string;
    }) {

        const {
            voucher,
            clientIP
        } = data;

        console.log(
            "========== LOGIN START =========="
        );

        console.log(
            "Voucher:",
            voucher
        );

        console.log(
            "Client IP:",
            clientIP
        );


        // ==================================================
        // 1. REDEEM VOUCHER
        // ==================================================

        const voucherData =
            await voucherService.redeem(
                voucher
            );

        console.log(
            "Voucher OK"
        );

        console.log(
            voucherData
        );


        // ==================================================
        // 2. GET CURRENT MACHINE
        // ==================================================

        const machine =
            await machineService.getCurrentMachine();

        if (!machine) {

            throw new Error(
                "Machine not registered."
            );

        }

        const machineId =
            machine.id;

        console.log(
            "Machine ID:",
            machineId
        );


        // ==================================================
        // 3. GET CLIENT MAC
        // ==================================================

        let clientMac = "";


        // --------------------------------------------------
        // 3A. Try WaitingClient first
        // --------------------------------------------------

        const waitingClient =
            await prisma.waitingClient.findFirst({

                where: {

                    machineId,

                    clientIP

                },

                orderBy: {

                    createdAt:
                        "desc"

                }

            });


        if (
            waitingClient?.clientMac
        ) {

            clientMac =
                waitingClient.clientMac;

            console.log(
                "Client MAC from WaitingClient:",
                clientMac
            );

        }


        // --------------------------------------------------
        // 3B. If not found, try MAC service
        // --------------------------------------------------

        if (!clientMac) {

            console.log(
                "No WaitingClient MAC found."
            );

            console.log(
                "Looking up MAC using macService..."
            );


            try {

                const detectedMac =
                    await macService.getMac(
                        clientIP
                    );


                if (detectedMac) {

                    clientMac =
                        detectedMac;

                }

            } catch (err) {

                console.error(
                    "MAC lookup failed:",
                    err
                );

            }


            console.log(
                "Client MAC from macService:",
                clientMac
            );

        }


        // --------------------------------------------------
        // 3C. MAC is required
        // --------------------------------------------------

        if (!clientMac) {

            throw new Error(
                "Unable to detect client MAC address."
            );

        }


        console.log(
            "Final Client MAC:",
            clientMac
        );


        // ==================================================
        // 4. CONVERT VOUCHER DURATION
        // ==================================================

        const durationMinutes =
            convertToMinutes(

                voucherData.package.duration,

                voucherData.package.durationUnit

            );


        console.log(
            "Duration:",
            durationMinutes,
            "minutes"
        );


        // ==================================================
        // 5. CREATE / EXTEND SESSION
        // ==================================================

        const session =
            await sessionService.createSession(

                machineId,

                voucherData.package.id,

                clientMac,

                clientIP,

                durationMinutes

            );


        console.log(
            "Session Created"
        );

        console.log(
            session
        );


        // ==================================================
        // 6. UPDATE VOUCHER
        // ==================================================

        await prisma.voucher.update({

            where: {

                id:
                    voucherData.id

            },

            data: {

                status:
                    "USED",

                usedByIP:
                    clientIP,

                usedAt:
                    new Date()

            }

        });


        console.log(
            "Voucher Updated"
        );


        // ==================================================
        // 7. LOGIN SUCCESS
        // ==================================================

        console.log(
            "========== LOGIN SUCCESS =========="
        );


        return {

            success:
                true,

            message:
                "Login Successful",

            session

        };

    }


    // ======================================================
    // LOGOUT
    // ======================================================

    async logout(
        clientIP: string
    ) {

        await ipsetService.block(
            clientIP
        );


        return {

            success:
                true,

            message:
                "Logged Out"

        };

    }

}


export const captiveLoginService =
    new CaptiveLoginService();