"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networkSocket = void 0;
const ws_1 = require("ws");
const networkMonitor_service_1 = require("../services/networkMonitor.service");
class NetworkSocket {
    wss;
    init(server) {
        this.wss = new ws_1.WebSocketServer({
            server,
            path: "/ws/network",
        });
        this.wss.on("connection", (ws) => {
            console.log("📡 Network Dashboard Connected");
            ws.send(JSON.stringify(networkMonitor_service_1.networkMonitor.getData()));
            ws.on("close", () => {
                console.log("📡 Network Dashboard Disconnected");
            });
        });
    }
    broadcast(data) {
        if (!this.wss)
            return;
        const json = JSON.stringify(data);
        this.wss.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(json);
            }
        });
    }
}
exports.networkSocket = new NetworkSocket();
