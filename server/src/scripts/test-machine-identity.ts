import {
    getMachineIdentity
} from "../modules/machine/machine.identity";


const identity =
    getMachineIdentity();


console.log(
    "\n========== BAYANNET MACHINE IDENTITY ==========\n"
);


console.log(
    "Machine ID:",
    identity.machineId
);


console.log(
    "Platform:",
    identity.platform
);


console.log(
    "Architecture:",
    identity.architecture
);


console.log(
    "Hostname:",
    identity.hostname
);


console.log(
    "MAC Address:",
    identity.macAddress
);


console.log(
    "Firmware Version:",
    identity.firmwareVersion
);


console.log(
    "\n================================================\n"
);