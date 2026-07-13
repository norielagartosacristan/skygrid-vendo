import { Server } from "ws";

class SubVendoSocket {

    private wss?: Server;

    private devices = new Map<string, any>();

    initialize(server: any) {

        this.wss = new Server({

            server,

            path: "/ws/subvendo"

        });

        this.wss.on("connection", (socket) => {

            console.log("SubVendo connected");

            socket.on("message", (msg) => {

                try {

                    const data = JSON.parse(msg.toString());

                    if (data.type === "register") {

                        this.devices.set(

                            data.chipId,

                            socket

                        );

                        console.log(

                            "Registered",

                            data.chipId

                        );

                    }

                } catch {}

            });

            socket.on("close", () => {

                console.log("Disconnected");

            });

        });

    }

    send(chipId: string, payload: any) {

        const socket =
            this.devices.get(chipId);

        if (!socket) return;

        socket.send(

            JSON.stringify(payload)

        );

    }

}

export const subVendoSocket =
    new SubVendoSocket();