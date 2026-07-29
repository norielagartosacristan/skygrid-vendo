import { Request, Response } from "express";
import { ipsetService } from "../firewall/ipset.service";
import { firewallRules } from "../firewall/firewallRules.service";
import prisma from "../../../config/prisma";
import { macService } from "../network/mac.service";


export async function allow(
    req: Request,
    res: Response
) {

    try {

        const { ip } = req.body;

        if (!ip) {

            return res.status(400).json({
                message: "IP address is required"
            });

        }

        await ipsetService.allow(ip);

        res.json({
            success: true,
            message: `${ip} allowed`
        });

    } catch (err: any) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

export async function block(
    req: Request,
    res: Response
) {

    try {

        const { ip } = req.body;

        await ipsetService.block(ip);

        res.json({
            success: true,
            message: `${ip} blocked`
        });

    } catch (err: any) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

export async function clients(
    _req: Request,
    res: Response
) {

    try {

        const data =
            await ipsetService.list();

        res.send(data);

    } catch (err: any) {

        res.status(500).json({
            message: err.message
        });

    }

}

export async function getSession(
    req: Request,
    res: Response
) {

    try {

        console.log(
            "========== GET SESSION STATUS =========="
        );

        const ip =
            req.query.ip as string;

        console.log(
            "Client IP:",
            ip
        );


        if (!ip) {

            return res.status(400).json({

                success: false,

                message:
                    "IP address is required"

            });

        }


        /**
         * ========================================
         * FIND ACTIVE SESSION
         * ========================================
         */

        const session =
            await prisma.session.findFirst({

                where: {

                    ipAddress:
                        ip,

                    isActive:
                        true

                },

                orderBy: {

                    createdAt:
                        "desc"

                }

            });


        /**
         * ========================================
         * NO ACTIVE SESSION
         * ========================================
         */

        if (!session) {

            return res.json({

                success: true,

                isActive: false,

                isPaused: false,

                internet: false,

                remainingSeconds: 0,

                remainingTime:
                    "00:00:00"

            });

        }


        /**
         * ========================================
         * PAUSED SESSION
         * ========================================
         *
         * Kapag paused:
         *
         * - expiresAt = null
         * - remainingSeconds ang source
         * - huwag i-compute gamit ang Date.now()
         * - huwag i-check ang expiration
         */

        if (session.isPaused) {

            const remainingSeconds =
                Math.max(
                    0,
                    session.remainingSeconds || 0
                );


            const hours =
                Math.floor(
                    remainingSeconds / 3600
                );


            const minutes =
                Math.floor(
                    (
                        remainingSeconds % 3600
                    ) / 60
                );


            const seconds =
                remainingSeconds % 60;


            const remainingTime =
                [
                    hours,
                    minutes,
                    seconds
                ]
                    .map(
                        value =>
                            String(value)
                                .padStart(
                                    2,
                                    "0"
                                )
                    )
                    .join(":");


            console.log(
                "⏸️ SESSION PAUSED"
            );


            console.log({

                ip,

                sessionId:
                    session.id,

                remainingSeconds,

                remainingTime

            });


            return res.json({

                success: true,

                isActive: true,

                isPaused: true,

                internet: false,

                remainingSeconds,

                remainingTime,

                expiresAt:
                    null,

                sessionId:
                    session.id

            });

        }


        /**
         * ========================================
         * RUNNING SESSION
         * ========================================
         */

        /**
         * Safety check:
         * Running session must have expiresAt.
         */

        if (!session.expiresAt) {

            console.error(
                "❌ Running session has no expiresAt:",
                session.id
            );


            return res.status(500).json({

                success: false,

                message:
                    "Session expiration time is missing."

            });

        }


        /**
         * Calculate remaining time
         */

        const remainingSeconds =
            Math.max(
                0,
                Math.floor(
                    (
                        session.expiresAt.getTime() -
                        Date.now()
                    ) / 1000
                )
            );


        /**
         * ========================================
         * CHECK FIREWALL
         * ========================================
         */

        const internet =
            await ipsetService.exists(
                ip
            );


        /**
         * ========================================
         * SESSION EXPIRED
         * ========================================
         */

        if (
            remainingSeconds <= 0
        ) {

            return res.json({

                success: true,

                isActive: false,

                isPaused: false,

                internet: false,

                remainingSeconds: 0,

                remainingTime:
                    "00:00:00",

                expiresAt:
                    session.expiresAt,

                sessionId:
                    session.id

            });

        }


        /**
         * ========================================
         * FORMAT HH:MM:SS
         * ========================================
         */

        const hours =
            Math.floor(
                remainingSeconds / 3600
            );


        const minutes =
            Math.floor(
                (
                    remainingSeconds % 3600
                ) / 60
            );


        const seconds =
            remainingSeconds % 60;


        const remainingTime =
            [
                hours,
                minutes,
                seconds
            ]
                .map(
                    value =>
                        String(value)
                            .padStart(
                                2,
                                "0"
                            )
                )
                .join(":");


        console.log({

            ip,

            sessionId:
                session.id,

            isPaused:
                false,

            remainingSeconds,

            remainingTime,

            internet

        });


        /**
         * ========================================
         * RETURN RUNNING SESSION
         * ========================================
         */

        return res.json({

            success: true,

            isActive: true,

            isPaused: false,

            internet,

            remainingSeconds,

            remainingTime,

            expiresAt:
                session.expiresAt,

            sessionId:
                session.id

        });

    } catch (err: any) {

        console.error(
            "GET SESSION STATUS ERROR:",
            err
        );


        return res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

}
export async function client(
    req: Request,
    res: Response
) {

    const ip =
        req.ip?.replace("::ffff:", "") ||
        req.socket.remoteAddress?.replace("::ffff:", "") ||
        "";

    const mac =
        macService.getMac(ip);

    res.json({
        ip,
        mac
    });

}




export async function enable(_req: Request, res: Response) {
    await firewallRules.initialize();

    res.json({
        success: true,
        message: "Captive Portal Enabled"
    });
}

export async function disable(_req: Request, res: Response) {
    // Mamaya natin lalagyan ng implementation
    res.json({
        success: true,
        message: "Captive Portal Disabled"
    });
}

export async function rules(_req: Request, res: Response) {
    const data = await firewallRules.showRules();

    res.send(data);
}