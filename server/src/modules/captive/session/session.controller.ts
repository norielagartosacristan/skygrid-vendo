import { Request, Response } from "express";

import {
    sessionService
} from "../session/session.service";


class SessionController {

    async pause(
    req: Request,
    res: Response
) {
    try {

        const { clientIP } = req.body;

        console.log(
            "[SESSION PAUSE] BODY:",
            req.body
        );

        console.log(
            "[SESSION PAUSE] CLIENT IP:",
            clientIP
        );

        if (!clientIP) {
            return res.status(400).json({
                success: false,
                message: "Client IP is required."
            });
        }

        const session =
            await sessionService.pauseSession(
                clientIP
            );

        return res.json({
            success: true,
            paused: true,
            session
        });

    } catch (error: any) {

        console.error(
            "[SESSION PAUSE ERROR]",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

    async resume(
        req: Request,
        res: Response
    ) {

        try {

            const {
                clientIP
            } = req.body;


            if (!clientIP) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Client IP is required."

                    });

            }


            const session =
                await sessionService.resumeSession(
                    clientIP
                );


            return res.json({

                success: true,

                paused: false,

                session

            });

        } catch (error: any) {

            console.error(
                "[SESSION RESUME ERROR]",
                error
            );


            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        error.message

                });

        }

    }

}


export const sessionController =
    new SessionController();