import { useEffect, useState } from "react";

export default function useNetworkSocket() {

    const [interfaces, setInterfaces] = useState<any[]>([]);

    useEffect(() => {

        const protocol =
            window.location.protocol === "https:"
                ? "wss"
                : "ws";

        const socket = new WebSocket(
            `${protocol}://${window.location.hostname}:5000/ws/network`
        );

        socket.onopen = () => {

            console.log("Connected to Network Monitor");

        };

        socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    console.log("WS DATA:", data);

    setInterfaces(data);
};

        socket.onclose = () => {

            console.log("Disconnected");

        };

        return () => {

            socket.close();

        };

    }, []);

    return interfaces;

}