import { Server, WebSocket } from "ws";
import { subVendoService } from "../services/subvendo.service";

class SubVendoSocket {
    private wss?: Server;
    private devices = new Map<string, WebSocket>();

    initialize(server: any) {
        console.log("Initializing SubVendo WebSocket on Standalone Path");

        // FIX: Tanggalin ang pag-bind sa HTTP server kung nag-e-conflict.
        // Hayaan natin ang ws library na humawak nang direkta sa port o sub-path handshake.
        this.wss = new Server({
            server, // panatilihin muna ito
            path: "/ws/subvendo",
            // Pwersahin natin ang pagtanggap sa sub-protocol kahit anong mangyari
            handleProtocols: (_protocols) => {
                return "arduino"; 
            }
        });

        console.log("SubVendo WebSocket initialized successfully");

        this.wss.on("connection", (socket: WebSocket, _req) => {
            console.log("====================================");
            console.log("🎯 SUBVENDO PHYSICAL CLIENT CONNECTED");
            console.log("====================================");

            let socketChipId: string | null = null;

            socket.on("message", async (msg) => {
                try {
                    console.log("RAW FROM ESP:", msg.toString());
                    const data = JSON.parse(msg.toString());

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
                                console.log("✅ DEVICE REGISTERED IN DB & MAP:", data.chipId);

                                // Magpadala ng ACK string sa ESP
                                socket.send(JSON.stringify({
                                    type: "register_ack",
                                    status: "success"
                                }));
                            } catch (dbErr: any) {
                                console.error("Database Save Error:", dbErr.message);
                            }
                            break;

                        case "heartbeat":
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
                    console.error("JSON Error:", err);
                }
            });

            socket.on("close", (code, reason) => {
                console.log(`❌ DISCONNECTED: Code ${code} | Reason: ${reason.toString()}`);
                if (socketChipId) this.devices.delete(socketChipId);
            });

            socket.on("error", (err) => {
                console.error("⚠️ SOCKET ERROR:", err);
                if (socketChipId) this.devices.delete(socketChipId);
            });
        });
    }

    send(chipId: string, payload: any) {
        const socket = this.devices.get(chipId);
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(payload));
        }
    }
}

export const subVendoSocket = new SubVendoSocket();