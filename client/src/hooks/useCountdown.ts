import { useState, useEffect } from "react";

export function useCountdown(expiresAt: string | number | Date) {
  const [remaining, setRemaining] = useState("00:00:00");

  useEffect(() => {
    if (!expiresAt) {
      setRemaining("00:00:00");
      return;
    }

    const calculateTimeLeft = () => {
      const difference = +new Date(expiresAt) - +new Date();
      
      if (difference <= 0) {
        return "00:00:00";
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const pad = (num: number) => String(num).padStart(2, "0");
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    // I-run agad sa simula
    setRemaining(calculateTimeLeft());

    // I-update bawat segundo
    const timer = setInterval(() => {
      setRemaining(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]); // Mahalaga: dapat kasama ang expiresAt sa dependency array

  return remaining;
}