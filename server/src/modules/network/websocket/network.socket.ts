import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { networkMonitor } from "../services/networkMonitor.service";

class NetworkSocket {

    private wss: WebSocketServer;

    constructor() {

        this.wss = new WebSocketServer({
            noServer: true,
        });

       this.wss.on(
    "connection",
    async (ws: WebSocket) => {

        console.log("================================");
        console.log("📡 NETWORK SOCKET CONNECTED");
        console.log("================================");

        ws.on("error", (error) => {

            console.error(
                "❌ NETWORK WS ERROR:",
                error
            );

        });

        ws.on(
            "close",
            (code, reason) => {

                console.log(
                    "📡 NETWORK WS CLOSED:",
                    code,
                    reason.toString()
                );

            }
        );

        try {

            // IMPORTANT:
            // Make sure cache is populated
            // before sending initial data.

            await networkMonitor.update();

            const data =
                networkMonitor.getData();

            ws.send(
                JSON.stringify(data)
            );

            console.log(
                "📡 INITIAL NETWORK DATA:",
                JSON.stringify(data, null, 2)
            );

            console.log(
                "📡 INITIAL NETWORK DATA LENGTH:",
                data.length
            );

            if (
                ws.readyState ===
                WebSocket.OPEN
            ) {

                ws.send(
                    JSON.stringify(data),
                    (error) => {

                        if (error) {

                            console.error(
                                "❌ INITIAL WS SEND ERROR:",
                                error
                            );

                            return;
                        }

                        console.log(
                            "✅ INITIAL WS DATA SENT"
                        );

                    }
                );

            }

        } catch (error) {

            console.error(
                "❌ NETWORK INITIAL DATA ERROR:",
                error
            );

        }

    }
);

    }

    upgrade(
        req: IncomingMessage,
        socket: any,
        head: Buffer
    ) {

        console.log(
            "🔌 NETWORK WS UPGRADE"
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

    broadcast(data: any) {

        const json =
            JSON.stringify(data);

        console.log(
            "📡 NETWORK BROADCAST:",
            json.length,
            "bytes"
        );

        this.wss.clients.forEach(
            (client: WebSocket) => {

                if (
                    client.readyState ===
                    WebSocket.OPEN
                ) {

                    client.send(
                        json,
                        (error) => {

                            if (error) {

                                console.error(
                                    "❌ BROADCAST ERROR:",
                                    error
                                );

                            }

                        }
                    );

                }

            }
        );

    }

}

export const networkSocket =
    new NetworkSocket();