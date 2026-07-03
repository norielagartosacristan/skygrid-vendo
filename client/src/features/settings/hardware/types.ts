export interface HardwareConfig {

    relayPin: number;
    relayActiveHigh: boolean;

    ledPin: number;

    buzzerPin: number;

    coinPin: number;
    coinTrigger: string;
    coinDebounce: number;
    
    resetPin: number;

    relayPulse: number;

    watchdog: boolean;

}