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

        this.wss.on("connection", (socket: WebSocket) => {

            console.log("================================");
            console.log("✅ SubVendo Connected");
            console.log("================================");

            socket.on("message", async (msg) => {

                try {

                    console.log("RAW MESSAGE:");
                    console.log(msg.toString());

                    const data = JSON.parse(msg.toString());

                    console.log("PARSED DATA:");
                    console.log(data);

                    switch (data.type) {

                        case "register":

                            await subVendoService.register({

                                chipId: data.chipId,

                                macAddress: data.macAddress,

                                firmwareVersion: data.firmwareVersion,

                                ipAddress: data.ipAddress

                            });

                            this.devices.set(

                                data.chipId,

                                socket

                            );

                            console.log(`✅ Registered: ${data.chipId}`);

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

                            console.log(`💓 Heartbeat: ${data.chipId}`);

                            break;

                        default:

                            console.log("⚠ Unknown message type:", data.type);

                    }

                } catch (err) {

                    console.error("SubVendo Socket Error:", err);

                }

            });

            socket.on("close", () => {

                console.log("❌ SubVendo Disconnected");

                for (const [chipId, ws] of this.devices.entries()) {

                    if (ws === socket) {

                        this.devices.delete(chipId);

                        break;

                    }

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

        socket.send(

            JSON.stringify(payload)

        );

    }

}

export const subVendoSocket = new SubVendoSocket();