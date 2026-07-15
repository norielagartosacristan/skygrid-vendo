import { Server, WebSocket } from "ws";
import { subVendoService } from "../services/subvendo.service";

class SubVendoSocket {

    private wss?: Server;
    private devices = new Map<string, WebSocket>();

    initialize(server: any) {
        console.log("Initializing SubVendo WebSocket");

        this.wss = new Server({
            server,
            path: "/ws/subvendo",
            // FIX 1: Ibalik ang "arduino" protocol para aprubahan ang handshake ng ESP
            handleProtocols: (protocols) => {
                if (protocols.has("arduino")) {
                    return "arduino";
                }
                return false;
            }
        });

        console.log("SubVendo WebSocket initialized");

        this.wss.on("connection", (socket: WebSocket, req) => {

            console.log("================================");
            console.log("NEW SUBVENDO SOCKET CONNECTED");
            console.log("================================");

            console.log("Headers:");
            console.log(req.headers);

            let socketChipId: string | null = null;

            socket.on("message", async (msg, isBinary) => {
                try {
                    // FIX 2: Siguraduhing maayos ang pag-decode kahit binary o text frame ang dumating
                    const rawMessage = isBinary ? msg : msg.toString();
                    console.log("RAW RECEIVED:", rawMessage.toString());

                    const data = JSON.parse(rawMessage.toString());
                    console.log("PARSED DATA:", data);

                    switch (data.type) {

                        case "register":
                            try {
                                const device = await subVendoService.register({
                                    chipId: data.chipId,
                                    macAddress: data.macAddress,
                                    firmwareVersion: data.firmwareVersion,
                                    ipAddress: data.ipAddress
                                });

                                socketChipId = data.chipId;
                                this.devices.set(data.chipId, socket);
                                console.log("REGISTER SUCCESS:", data.chipId);

                                // Magpadala ng confirmation sa ESP
                                socket.send(JSON.stringify({
                                    type: "register_ack",
                                    status: "success",
                                    message: "Device registered/awaiting approval"
                                }));

                            } catch (regError: any) {
                                console.error("Registration Service Error:", regError.message);
                                socket.send(JSON.stringify({
                                    type: "register_ack",
                                    status: "error",
                                    message: regError.message
                                }));
                            }
                            break;

                        case "heartbeat":
                            console.log("HEARTBEAT RECEIVED:", data.chipId);

                            await subVendoService.heartbeat({
                                chipId: data.chipId,
                                freeMemory: data.freeMemory,
                                uptime: data.uptime,
                                wifiSignal: data.wifiSignal,
                                temperature: data.temperature ?? 0,
                                connectedClients: data.connectedClients ?? 0
                            });

                            socket.send(JSON.stringify({ type: "heartbeat_ack" }));
                            break;
                    }

                } catch (err) {
                    console.error("Failed to parse message from ESP:", err);
                }
            });

            socket.on("close", (code, reason) => {
                console.log("================================");
                console.log("SUBVENDO CLOSED");
                console.log("Code:", code);
                console.log("Reason:", reason.toString());
                console.log("================================");
                
                if (socketChipId) {
                    this.devices.delete(socketChipId);
                }
            });

            socket.on("error", (err) => {
                console.log("================================");
                console.log("SOCKET ERROR");
                console.log(err);
                console.log("================================");
                
                if (socketChipId) {
                    this.devices.delete(socketChipId);
                }
            });
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