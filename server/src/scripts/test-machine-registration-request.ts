import {
    requestMachineRegistration
} from "../modules/machine/machine.registration";


async function main() {

    try {

        const result =
            await requestMachineRegistration();


        console.log(
            "\n========== REGISTRATION RESULT ==========\n"
        );


        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );


        if (
            result.registered
        ) {

            console.log(
                "\nMachine is already registered."
            );

            return;

        }


        if (
            result.registration
        ) {

            console.log(
                "\n=========================================="
            );


            console.log(
                "REGISTRATION CODE:",
                result.registration.code
            );


            console.log(
                "EXPIRES AT:",
                result.registration.expiresAt
            );


            console.log(
                "=========================================="
            );

        }


    } catch (error) {

        console.error(
            "\nUnable to request machine registration."
        );


        process.exit(
            1
        );

    }

}


main();