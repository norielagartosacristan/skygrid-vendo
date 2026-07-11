"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captiveSocket = void 0;
const ws_1 = require("ws");
const url_1 = require("url");
class CaptiveSocket {
    wss;
    clients = new Map();
    init(server) {
        this.wss = new ws_1.WebSocketServer({
            server,
            path: "/ws/session",
        });
        this.wss.on("connection", (ws, req) => {
            const url = new url_1.URL(req.url || "", `http://${req.headers.host}`);
            const clientIP = url.searchParams.get("ip");
            if (!clientIP) {
                ws.close();
                return;
            }
            console.log(`📱 Captive Connected: ${clientIP}`);
            this.clients.set(clientIP, ws);
            ws.on("close", () => {
                console.log(`📱 Captive Disconnected: ${clientIP}`);
                this.clients.delete(clientIP);
            });
        });
    }
    send(clientIP, data) {
        const ws = this.clients.get(clientIP);
        if (!ws)
            return;
        if (ws.readyState !== ws_1.WebSocket.OPEN)
            return;
        ws.send(JSON.stringify(data));
    }
}
exports.captiveSocket = new CaptiveSocket();
