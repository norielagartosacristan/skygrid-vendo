import { useState } from "react";
import type { HardwareConfig } from "../types";

export function useHardware() {

    const [config, setConfig] = useState<HardwareConfig>({
        relayPin: 5,
        relayActiveHigh: true,

        ledPin: 2,
        buzzerPin: 14,

        coinPin: 12,
        coinTrigger: "FALLING",
        coinDebounce: 30,

        resetPin: 0,

        relayPulse: 1000,

        watchdog: true,
        });

    return {
        config,
        setConfig,
    };

}