import { useEffect, useState } from "react";

export default function useNetworkSocket() {

    const [interfaces, setInterfaces] = useState<any[]>([]);

    useEffect(() => {

        const protocol =
            window.location.protocol === "https:"
                ? "wss"
                : "ws";

        const wsUrl =
            `${protocol}://${window.location.hostname}/ws/network`;

        console.log("🔌 WS URL:", wsUrl);

        const socket = new WebSocket(wsUrl);

        console.log("🔌 WS CREATED:", socket.url);

        socket.onopen = () => {

            console.log("🟢 WS OPEN");
            console.log("🟢 WS URL:", socket.url);
            console.log("🟢 WS PROTOCOL:", socket.protocol);
            console.log("🟢 WS READY STATE:", socket.readyState);

        };

    socket.onmessage = (event) => {

    console.log("📨 WS RAW DATA:", event.data);
    console.log("📨 WS DATA TYPE:", typeof event.data);

    try {

        const data = JSON.parse(event.data);

        console.log("📦 WS PARSED:", data);
        console.log("📦 IS ARRAY:", Array.isArray(data));

        if (data?.type) {
            return;
        }

        if (Array.isArray(data)) {
            setInterfaces(data);
        }

    } catch (error) {

        console.error(
            "❌ WS JSON PARSE ERROR:",
            error
        );

    }

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