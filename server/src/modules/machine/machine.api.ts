import axios from "axios";

import {
    getMachineIdentity
} from "./machine.identity";


const API_BASE_URL =
    process.env.BAYANNET_API_URL ||
    "http://localhost:5100";


export async function registerMachine() {

    const identity =
        getMachineIdentity();


    console.log(
        "Registering machine:",
        identity.machineId
    );


    const response =
        await axios.post(

            `${API_BASE_URL}/api/machines/register`,

            {

                machineId:
                    identity.machineId,

                name:
                    identity.hostname,

                platform:
                    identity.platform,

                architecture:
                    identity.architecture,

                macAddress:
                    identity.macAddress,

                firmwareVersion:
                    identity.firmwareVersion

            }

        );


    return response.data;

}