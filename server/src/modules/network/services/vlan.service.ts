import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface CreateVlanOptions {
    parentInterface: string;
    vlanId: number;
    name?: string;
    ipAddress: string;
    prefix?: number;
}

export async function createVlan(options: CreateVlanOptions) {

    const {
        parentInterface,
        vlanId,
        ipAddress,
        prefix = 24,
    } = options;

    const name =
        options.name ||
        `${parentInterface}.${vlanId}`;

    // Check kung existing na
    try {

        await execAsync(
            `ip link show ${name}`
        );

        // Existing VLAN → siguraduhing UP
        await execAsync(
            `sudo ip link set ${name} up`
        );

        return {
            success: true,
            created: false,
            name,
        };

    } catch {
        // Hindi pa existing, kaya gagawa tayo
    }

    // CREATE VLAN
    await execAsync(
        `sudo ip link add link ${parentInterface} name ${name} type vlan id ${vlanId}`
    );

    // Assign gateway IP
    await execAsync(
        `sudo ip addr add ${ipAddress}/${prefix} dev ${name}`
    );

    // UP
    await execAsync(
        `sudo ip link set ${name} up`
    );

    return {
        success: true,
        created: true,
        name,
        ipAddress,
        prefix,
        vlanId,
        parentInterface,
    };
}