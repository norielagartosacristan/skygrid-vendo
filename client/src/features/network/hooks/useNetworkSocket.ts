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

        console.log("🔌 NETWORK WS:", wsUrl);

        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("🟢 NETWORK WS CONNECTED");
        };

        socket.onmessage = (event) => {
            console.log("📨 NETWORK WS DATA:", event.data);

            try {
                const data = JSON.parse(event.data);

                if (!Array.isArray(data)) {
                    console.log(
                        "ℹ️ Ignoring non-interface message:",
                        data
                    );
                    return;
                }

                console.log(
                    `📡 Interfaces received: ${data.length}`
                );

                setInterfaces(data);

            } catch (error) {
                console.error(
                    "❌ NETWORK WS JSON ERROR:",
                    error
                );
            }
        };

        socket.onerror = (error) => {
            console.error(
                "❌ NETWORK WS ERROR:",
                error
            );
        };

        socket.onclose = (event) => {
            console.log(
                "🔴 NETWORK WS CLOSED:",
                event.code,
                event.reason
            );
        };

        return () => {
            console.log("🧹 Closing NETWORK WS");
            socket.close();
        };
    }, []);

    return interfaces;
}