import { Server, WebSocket } from "ws";
import { subVendoService } from "../services/subvendo.service";

class SubVendoSocket {

    private wss?: Server;

    private devices = new Map<string, WebSocket>();

   initialize(server: any) {
        console.log("Initializing SubVendo WebSocket");

    this.wss = new Server({

        server,

        path: "/ws/subvendo"

    });

        console.log("SubVendo WebSocket initialized");


    this.wss.on("connection", (socket: WebSocket, req) => {

    console.log("================================");
    console.log("NEW SUBVENDO SOCKET CONNECTED");
    console.log("================================");

    console.log("Headers:");
    console.log(req.headers);

    socket.on("message", async (msg) => {

        console.log("RAW:", msg.toString());

        try {

            const data = JSON.parse(msg.toString());

            console.log(data);

            switch (data.type) {

                case "register":

                    await subVendoService.register({

                        chipId: data.chipId,
                        macAddress: data.macAddress,
                        firmwareVersion: data.firmwareVersion,
                        ipAddress: data.ipAddress

                    });

                    this.devices.set(data.chipId, socket);

                    console.log("REGISTER:", data.chipId);

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

                    break;
            }

        } catch (err) {

            console.error(err);

        }

    });

    socket.on("close", (code, reason) => {

        console.log("================================");
        console.log("SUBVENDO CLOSED");
        console.log("Code:", code);
        console.log("Reason:", reason.toString());
        console.log("================================");

    });

    socket.on("error", (err) => {

        console.log("================================");
        console.log("SOCKET ERROR");
        console.log(err);
        console.log("================================");

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

    
handleUpgrade(req: any, socket: any, head: any) {

    this.wss!.handleUpgrade(req, socket, head, (ws) => {

        console.log("NEW SUBVENDO SOCKET CONNECTED");

        this.wss!.emit("connection", ws, req);

    });

}

}


export const subVendoSocket = new SubVendoSocket();