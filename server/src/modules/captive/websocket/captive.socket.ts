import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { URL } from "url";

class CaptiveSocket {

    private wss?: WebSocketServer;

    private clients = new Map<string, WebSocket>();

    init(server: Server) {

        this.wss = new WebSocketServer({

            server,

            path: "/ws/session",

        });

        this.wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {

            const url = new URL(
                req.url || "",
                `http://${req.headers.host}`
            );

            const clientIP =
                url.searchParams.get("ip");

            if (!clientIP) {

                ws.close();

                return;

            }

            console.log(
                `📱 Captive Connected: ${clientIP}`
            );

            this.clients.set(clientIP, ws);

            ws.on("close", () => {

                console.log(
                    `📱 Captive Disconnected: ${clientIP}`
                );

                this.clients.delete(clientIP);

            });

        });

    }

    send(clientIP: string, data: any) {

        const ws = this.clients.get(clientIP);

        if (!ws)
            return;

        if (ws.readyState !== WebSocket.OPEN)
            return;

        ws.send(JSON.stringify(data));

    }

}

export const captiveSocket =
    new CaptiveSocket();