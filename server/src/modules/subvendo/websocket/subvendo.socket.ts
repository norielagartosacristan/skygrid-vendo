import { Server, WebSocket } from "ws";
import { subVendoService } from "../services/subvendo.service";

class SubVendoSocket {
    private wss?: Server;
    private devices = new Map<string, WebSocket>();

    initialize() {
        console.log("Initializing Standalone SubVendo WebSocket on Port 5001");

        // FIX: Gumamit ng standalone port para iwas salpukan sa ibang routes ng port 5000
        this.wss = new Server({

            noServer: true,
            path: "/ws/subvendo",
            handleProtocols: (protocols) => {
                // Awtomatikong tanggapin ang 'arduino' sub-protocol ng NodeMCU
                if (protocols.has("arduino")) {
                    return "arduino";
                }
                return false;
            }
        });

        console.log("SubVendo WebSocket Server listening on port 5001");

        this.wss.on("connection", (socket: WebSocket) => {
            console.log("====================================");
            console.log("🎯 SUBVENDO PHYSICAL CLIENT CONNECTED");
            console.log("====================================");

            let socketChipId: string | null = null;

            socket.on("message", async (msg) => {
                try {
                    console.log("RAW FROM ESP:", msg.toString());
                    const data = JSON.parse(msg.toString());

                    if (data.type === "register") {
                        await subVendoService.register({
                            chipId: data.chipId,
                            macAddress: data.macAddress,
                            firmwareVersion: data.firmwareVersion,
                            ipAddress: data.ipAddress
                        });

                        socketChipId = data.chipId;
                        this.devices.set(data.chipId, socket);
                        console.log("✅ REGISTERED SUCCESS:", data.chipId);

                        // Mag-reply ng success para hindi mag-disconnect ang ESP
                        socket.send(JSON.stringify({ type: "register_ack", status: "success" }));
                    }

                    if (data.type === "heartbeat") {
                        await subVendoService.heartbeat({
                            chipId: data.chipId,
                            freeMemory: data.freeMemory,
                            uptime: data.uptime,
                            wifiSignal: data.wifiSignal,
                            temperature: data.temperature ?? 0,
                            connectedClients: data.connectedClients ?? 0
                        });
                    }
                } catch (err) {
                    console.error("Payload process error:", err);
                }
            });

            socket.on("close", (code, reason) => {
                console.log(`❌ DISCONNECTED: Code ${code} | Reason: ${reason.toString()}`);
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