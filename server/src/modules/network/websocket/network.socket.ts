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
            (ws: WebSocket) => {

                console.log("================================");
                console.log("📡 NETWORK SOCKET CONNECTED");
                console.log("================================");

                // ==========================================
                // ERROR
                // ==========================================

                ws.on("error", (error) => {

                    console.error(
                        "❌ NETWORK WS ERROR:",
                        error
                    );

                });

                // ==========================================
                // CLOSE
                // ==========================================

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

                // ==========================================
                // INITIAL DATA
                // ==========================================

                const data =
                    networkMonitor.getData();

                console.log(
                    "NETWORK INITIAL DATA TYPE:",
                    typeof data
                );

                console.log(
                    "NETWORK INITIAL DATA ARRAY:",
                    Array.isArray(data)
                );

                console.log(
                    "NETWORK INITIAL DATA LENGTH:",
                    Array.isArray(data)
                        ? data.length
                        : "N/A"
                );

                try {

                    const payload =
                        JSON.stringify(data);

                    console.log(
                        "WS PAYLOAD LENGTH:",
                        payload.length
                    );

                    if (
                        ws.readyState !==
                        WebSocket.OPEN
                    ) {

                        console.warn(
                            "⚠️ WS NOT OPEN — INITIAL DATA NOT SENT"
                        );

                        return;
                    }

                    ws.send(
                        payload,
                        (error) => {

                            if (error) {

                                console.error(
                                    "❌ WS SEND ERROR:",
                                    error
                                );

                            } else {

                                console.log(
                                    "✅ INITIAL WS DATA SENT"
                                );

                            }

                        }
                    );

                } catch (error) {

                    console.error(
                        "❌ WS SERIALIZE ERROR:",
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