import { Session } from "@prisma/client";

export interface InsertCoinRequest {

    clientMac: string;

    clientIP: string;

    amount: number;

}

export interface InsertCoinResponse {

    success: boolean;

    session: Session;

}