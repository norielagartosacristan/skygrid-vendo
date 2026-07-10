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

                console.log("📡 Network Dashboard Connected");

                ws.send(
                    JSON.stringify(networkMonitor.getData())
                );

                ws.on("close", () => {
                    console.log("📡 Network Dashboard Disconnected");
                });

            });
    }

    broadcast(data: any) {

        if (!this.wss) return;

        const json = JSON.stringify(data);

        this.wss.clients.forEach((client: WebSocket) => {

            if (client.readyState === WebSocket.OPEN) {

                client.send(json);

            }

        });

    }

}

export const networkSocket = new NetworkSocket();