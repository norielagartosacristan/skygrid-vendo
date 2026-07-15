import { Server, WebSocket } from "ws";
import { subVendoService } from "../services/subvendo.service";

class SubVendoSocket {

    private wss?: Server;
    private devices = new Map<string, WebSocket>();

   initialize(server: any) {

    this.wss = new Server({
        server,
        path: "/ws/subvendo"
    });

    this.wss.on("connection", (ws, req) => {

        console.log("CONNECTED");

        ws.send("HELLO");

        ws.on("message", (msg) => {
            console.log(msg.toString());
        });

        ws.on("close", (code, reason) => {
            console.log("CLOSE", code, reason.toString());
        });

        ws.on("error", console.error);

    });

}

    send(chipId: string, payload: any) {
        const socket = this.devices.get(chipId);
        if (!socket) {
            console.log(`Device ${chipId} is offline.`);
            return;
        }
        socket.send(JSON.stringify(payload));
    }

}

export const subVendoSocket = new SubVendoSocket();