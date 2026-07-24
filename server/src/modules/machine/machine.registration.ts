import axios from "axios";

import {
    getMachineIdentity
} from "./machine.identity";


const API_BASE_URL =
    process.env.BAYANNET_API_URL ||
    "http://localhost:5100";


interface RegistrationResult {

    success: boolean;

    registered: boolean;

    message: string;

    registration?: {

        code: string;

        expiresAt: string;

    };

    machine?: {

        id: string;

        machineId: string;

        status: string;

    };

}


export async function requestMachineRegistration(): Promise<RegistrationResult> {

    const identity =
        getMachineIdentity();


    console.log(
        "\n========== REQUEST MACHINE REGISTRATION =========="
    );


    console.log(
        "Machine ID:",
        identity.machineId
    );


    try {

        const response =
            await axios.post<RegistrationResult>(

                `${API_BASE_URL}/api/machines/request-registration`,

                {

                    machineId:
                        identity.machineId

                }

            );


        console.log(
            "Registration response:",
            response.data
        );


        return response.data;


    } catch (error: any) {

        console.error(
            "REQUEST MACHINE REGISTRATION ERROR:"
        );


        if (
            error.response
        ) {

            console.error(
                error.response.data
            );

        } else {

            console.error(
                error.message
            );

        }


        throw error;

    }

}