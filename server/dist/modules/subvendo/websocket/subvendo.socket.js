"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subVendoSocket = void 0;
const ws_1 = require("ws");
class SubVendoSocket {
    wss;
    devices = new Map();
    initialize(server) {
        this.wss = new ws_1.Server({
            server,
            path: "/ws/subvendo"
        });
        this.wss.on("connection", (socket) => {
            console.log("SubVendo connected");
            socket.on("message", (msg) => {
                try {
                    const data = JSON.parse(msg.toString());
                    if (data.type === "register") {
                        this.devices.set(data.chipId, socket);
                        console.log("Registered", data.chipId);
                    }
                }
                catch { }
            });
            socket.on("close", () => {
                console.log("Disconnected");
            });
        });
    }
    send(chipId, payload) {
        const socket = this.devices.get(chipId);
        if (!socket)
            return;
        socket.send(JSON.stringify(payload));
    }
}
exports.subVendoSocket = new SubVendoSocket();
