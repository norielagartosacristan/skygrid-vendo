import prisma from "../../../config/prisma";

class MachineAssociationService {

    async restoreSubVendoAssociations(machineId: string) {

        console.log(
            "========== RESTORE SUBVENDO ASSOCIATIONS =========="
        );

        console.log(
            "Main Vendo Machine ID:",
            machineId
        );

        /**
         * Hanapin ang SubVendo na walang Main Vendo.
         */
        const result =
            await prisma.subVendo.updateMany({

                where: {

                    machineId: null,

                    status: "CONFIGURED",

                },

                data: {

                    machineId,

                },

            });

        console.log(
            "SubVendo associations restored:",
            result.count
        );

        console.log(
            "===================================================="
        );

        return result;

    }

}

export const machineAssociationService =
    new MachineAssociationService();