import {
    registerMachine
} from "../modules/machine/machine.api";


async function main() {

    try {

        const result =
            await registerMachine();


        console.log(
            "\n========== RESULT =========="
        );


        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );


    } catch (error) {

        console.error(
            "\nMachine registration failed."
        );

        process.exit(
            1
        );

    }

}


main();