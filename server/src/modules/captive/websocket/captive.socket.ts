import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { URL } from "url";

class CaptiveSocket {

    private wss: WebSocketServer;

    private clients =
        new Map<string, WebSocket>();

    constructor() {

        this.wss = new WebSocketServer({
            noServer: true,
        });

        this.wss.on(
            "connection",
            (
                ws: WebSocket,
                req: IncomingMessage
            ) => {

                console.log("================================");
                console.log("📱 SESSION SOCKET CONNECTED");
                console.log("================================");

                // ==========================================
                // GET CLIENT IP
                // ==========================================

                const url =
                    new URL(
                        req.url || "",
                        `http://${req.headers.host}`
                    );

                const clientIP =
                    url.searchParams.get("ip");

                if (!clientIP) {

                    console.warn(
                        "⚠️ SESSION WS WITHOUT CLIENT IP"
                    );

                    ws.close();

                    return;

                }

                console.log(
                    `📱 Captive Connected: ${clientIP}`
                );

                // ==========================================
                // SAVE CLIENT
                // ==========================================

                this.clients.set(
                    clientIP,
                    ws
                );

                // ==========================================
                // ERROR
                // ==========================================

                ws.on(
                    "error",
                    (error) => {

                        console.error(
                            "❌ SESSION WS ERROR:",
                            error
                        );

                    }
                );

                // ==========================================
                // CLOSE
                // ==========================================

                ws.on(
                    "close",
                    () => {

                        console.log(
                            `📱 Captive Disconnected: ${clientIP}`
                        );

                        this.clients.delete(
                            clientIP
                        );

                    }
                );

            }
        );

    }

    upgrade(
        req: IncomingMessage,
        socket: any,
        head: Buffer
    ) {

        console.log(
            "🔌 SESSION WS UPGRADE"
        );

        this.wss.handleUpgrade(
            req,
            socket,
            head,
            (ws) => {

                this.wss.emit(
                    "connection",
                    ws,
                    req
                );

            }
        );

    }

    send(
        clientIP: string,
        data: any
    ) {

        const ws =
            this.clients.get(clientIP);

        if (!ws) {

            console.log(
                `⚠️ No WS client for ${clientIP}`
            );

            return;

        }

        if (
            ws.readyState !==
            WebSocket.OPEN
        ) {

            console.log(
                `⚠️ WS not open for ${clientIP}`
            );

            return;

        }

        ws.send(
            JSON.stringify(data)
        );

    }

}

export const captiveSocket =
    new CaptiveSocket();