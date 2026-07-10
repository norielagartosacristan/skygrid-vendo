import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";

class NetworkSocket {

    private wss?: WebSocketServer;

    init(server: Server) {

        this.wss = new WebSocketServer({

            server,

            path: "/ws/network",

        });

        this.wss.on("connection", (ws: WebSocket) => {

            console.log("📡 Network Dashboard Connected");

            ws.on("close", (code, reason) => {

                console.log("📡 Network Dashboard Disconnected");
                console.log("Code:", code);
                console.log("Reason:", reason.toString());

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