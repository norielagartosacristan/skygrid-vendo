import { useRef } from "react";

export function useSound(src: string) {

    const audio = useRef(new Audio(src));

    const play = () => {

        audio.current.pause();
        audio.current.currentTime = 0;

        audio.current.play().catch(() => {});

    };

    return play;

}