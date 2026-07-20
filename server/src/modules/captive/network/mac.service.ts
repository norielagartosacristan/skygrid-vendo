import { execSync } from "child_process";

class MacService {

    getMac(ip: string): string {

        try {

            const output = execSync(
                `ip neigh show ${ip}`
            ).toString();

            const match = output.match(
                /lladdr\s+([0-9a-f:]+)/i
            );

            if (!match) {
                return "";
            }

            return match[1].toUpperCase();

        } catch {

            return "";

        }

    }

}

export const macService = new MacService();