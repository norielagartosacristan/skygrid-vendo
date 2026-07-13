export interface RegisterSubVendoRequest {

    chipId: string;

    macAddress: string;

    firmwareVersion: string;

    ipAddress: string;

}

export interface HeartbeatRequest {

    chipId: string;

    freeMemory: number;

    uptime: number;

    wifiSignal: number;

    temperature: number;

    connectedClients: number;

}