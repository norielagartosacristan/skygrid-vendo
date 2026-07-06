import { useEffect, useState } from "react";

export function useCountdown(endTime?: string | Date) {

    const [remaining, setRemaining] = useState("00:00:00");

    useEffect(() => {

        if (!endTime) {
            setRemaining("00:00:00");
            return;
        }

        const update = () => {

            const diff =
                new Date(endTime).getTime() - Date.now();

            if (diff <= 0) {
                setRemaining("00:00:00");
                return;
            }

            const total = Math.floor(diff / 1000);

            const h = Math.floor(total / 3600);
            const m = Math.floor((total % 3600) / 60);
            const s = total % 60;

            setRemaining(
                `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
            );
        };

        update();

        const timer = setInterval(update, 1000);

        return () => clearInterval(timer);

    }, [endTime]);

    return remaining;
}