import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { networkMonitor } from "../services/networkMonitor.service";

class NetworkSocket {

    private wss?: WebSocketServer;

    init(server: Server) {

        this.wss = new WebSocketServer({
            server,
            path: "/ws/network",
        });

        this.wss.on("connection", (ws) => {

            console.log("================================");
            console.log("📡 NETWORK SOCKET CONNECTED");
            console.log("================================");

            const data = networkMonitor.getData();

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

            console.log(
                "NETWORK INITIAL DATA:",
                JSON.stringify(data)
            );

            try {

                const payload =
                    JSON.stringify(data);

                console.log(
                    "WS PAYLOAD LENGTH:",
                    payload.length
                );

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

            ws.on("error", (error) => {

                console.error(
                    "❌ NETWORK WS ERROR:",
                    error
                );

            });

            ws.on("close", (
                code,
                reason
            ) => {

                console.log(
                    "📡 NETWORK WS CLOSED:",
                    code,
                    reason.toString()
                );

            });

        });

    }

    broadcast(data: any) {

        if (!this.wss) return;

        const json = JSON.stringify(data);

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