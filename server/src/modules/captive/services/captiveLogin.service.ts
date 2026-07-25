import { voucherService } from "../../voucher/services/voucher.service";
import { ipsetService } from "../firewall/ipset.service";
import prisma from "../../../config/prisma";
import { sessionService } from "../session/session.service";
import { convertToMinutes } from "../../../utils/time";
import { machineService } from "../../machine/services/machine.service";

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
        "Client:",
        clientIP
    );


    // 1. Redeem voucher
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


    // 2. Get current machine
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


    // 3. Get client MAC
    const mac =
        await prisma.waitingClient.findFirst({

            where: {

                clientIP

            },

            orderBy: {

                createdAt:
                    "desc"

            }

        });


    const clientMac =
        mac?.clientMac ||
        "";


    console.log(
        "Client MAC:",
        clientMac
    );


    if (!clientMac) {

        throw new Error(
            "Unable to detect client MAC address."
        );

    }


    // 4. Convert voucher duration
    const durationMinutes =
        convertToMinutes(
            voucherData.package.duration,
            voucherData.package.durationUnit,
            0,
            0
        );


    console.log(
        "Duration:",
        durationMinutes,
        "minutes"
    );


    // 5. Create or extend session
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


    // 6. Update voucher
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