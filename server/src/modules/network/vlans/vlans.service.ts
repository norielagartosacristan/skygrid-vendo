import prisma from "../../../config/prisma";
import { commandService } from "../command/command.service";

class VlanService {

    async create(data: any) {

        const interfaceName =
            `${data.parent}.${data.vlanId}`;

        const exists =
            await commandService.exists(
                `ip link show ${interfaceName}`
            );

        if (exists) {

            throw new Error(
                "VLAN already exists."
            );

        }

        await commandService.run(
            `sudo ip link add link ${data.parent} name ${interfaceName} type vlan id ${data.vlanId}`
        );

        await commandService.run(
            `sudo ip addr add ${data.gateway}/24 dev ${interfaceName}`
        );

        await commandService.run(
            `sudo ip link set ${interfaceName} up`
        );

        return prisma.vlan.create({
            data
        });

    }

}

export const vlanService = new VlanService();