import { useEffect, useState } from "react";

export default function useNetworkSocket() {

    const [interfaces, setInterfaces] = useState<any[]>([]);

    useEffect(() => {

        const protocol =
            window.location.protocol === "https:"
                ? "wss"
                : "ws";

        const socket = new WebSocket(
            `${protocol}://${window.location.hostname}/ws/network`
        );

        socket.onopen = () => {

            console.log("Connected to Network Monitor");

        };

       socket.onmessage = (event) => {

    const data = JSON.parse(event.data);

    console.log("WS DATA:", data);

    // Ignore session messages
    if (data.type) {
        return;
    }

    setInterfaces(data);

};

       socket.onclose = (event) => {

            console.log("Disconnected");

            console.log("Close Code:", event.code);
            console.log("Reason:", event.reason);
            console.log("Clean:", event.wasClean);

        };

        return () => {

            socket.close();

        };

    }, []);

    return interfaces;

}