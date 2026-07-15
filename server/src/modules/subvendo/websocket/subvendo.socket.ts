import { Server, WebSocket } from "ws";
import { subVendoService } from "../services/subvendo.service";

class SubVendoSocket {

    private wss?: Server;
    private devices = new Map<string, WebSocket>();

    initialize(_server: any) {
        console.log("Initializing SubVendo WebSocket");

        this.wss = new Server({
            noServer: true,
            //path: "/ws/subvendo"
        });

        console.log("SubVendo WebSocket initialized");

        this.wss.on("connection", (socket: WebSocket, req) => {

            console.log("================================");
            console.log("NEW SUBVENDO SOCKET CONNECTED");
            console.log("================================");

            console.log("Headers:");
            console.log(req.headers);

            // Gagawa tayo ng flag para ma-track kung anong chipId ang hawak ng socket na ito para sa cleanup
            let socketChipId: string | null = null;

            socket.on("message", async (msg) => {
                console.log("RAW:", msg.toString());

                try {
                    const data = JSON.parse(msg.toString());
                    console.log(data);

                    switch (data.type) {

                        case "register":
                            try {
                                // 1. Subukan i-register ang device gamit ang iyong service.
                                // Dapat sa loob ng service na ito, kapag bago ang chipId,
                                // i-insert ito sa DB na may status: 'pending' at HUWAG mag-throw ng error.
                                const device = await subVendoService.register({
                                    chipId: data.chipId,
                                    macAddress: data.macAddress,
                                    firmwareVersion: data.firmwareVersion,
                                    ipAddress: data.ipAddress
                                });

                                // 2. I-save ang aktibong socket connection
                                socketChipId = data.chipId;
                                this.devices.set(data.chipId, socket);
                                console.log("REGISTER SUCCESS:", data.chipId);

                                // 3. IMPORTANT: Magpadala ng feedback sa ESP para malaman nitong success ang registration!
                                socket.send(JSON.stringify({
                                    type: "register_ack",
                                    status: "success",
                                    message: "Device registered/awaiting approval"
                                }));

                            } catch (regError: any) {
                                console.error("Error during sub-vendo registration service:", regError.message);
                                
                                // Mag-reply sa ESP na may error para hindi ito mag-hang
                                socket.send(JSON.stringify({
                                    type: "register_ack",
                                    status: "error",
                                    message: regError.message || "Registration failed"
                                }));
                                
                                // I-close ang socket kung talagang bawal
                                socket.close(4001, "Registration Failed");
                            }
                            break;

                        case "heartbeat":
                            console.log("HEARTBEAT:", data.chipId);

                            await subVendoService.heartbeat({
                                chipId: data.chipId,
                                freeMemory: data.freeMemory,
                                uptime: data.uptime,
                                wifiSignal: data.wifiSignal,
                                temperature: data.temperature ?? 0,
                                connectedClients: data.connectedClients ?? 0
                            });

                            // Opsyonal: Mag-reply rin ng heartbeat response
                            socket.send(JSON.stringify({ type: "heartbeat_ack" }));
                            break;
                    }

                } catch (err) {
                    console.error("JSON Parse or Handling Error:", err);
                }
            });

            socket.on("close", (code, reason) => {
                console.log("================================");
                console.log("SUBVENDO CLOSED");
                console.log("Code:", code);
                console.log("Reason:", reason.toString());
                console.log("================================");
                
                // Burahin sa active devices map kapag nag-disconnect
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

    handleUpgrade(req: any, socket: any, head: any) {
        this.wss!.handleUpgrade(req, socket, head, (ws) => {
            console.log("NEW SUBVENDO SOCKET CONNECTED (UPGRADE)");
            this.wss!.emit("connection", ws, req);
        });
    }
}

export const subVendoSocket = new SubVendoSocket();