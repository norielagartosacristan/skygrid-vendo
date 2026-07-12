import { useRef } from "react";

export function useSound(src: string) {
    const audio = useRef(new Audio(src));

    const play = () => {
        audio.current.currentTime = 0;
        audio.current.play().catch(() => {});
    };

    const stop = () => {
        audio.current.pause();
        audio.current.currentTime = 0;
    };

    return {
        play,
        stop,
    };
}