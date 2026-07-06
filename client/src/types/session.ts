export interface Session {

    id: string;

    macAddress: string;

    ipAddress?: string;

    packageName: string;

    startTime: string;

    endTime: string;

    isActive: boolean;

}