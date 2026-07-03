import OutputsCard from "./components/OutputsCard";
import InputsCard from "./components/InputsCard";

import { useHardware } from "./hooks/useHardware";

export default function HardwareSettings() {

    const {
        config,
        setConfig,
    } = useHardware();

    return (

        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Hardware Settings
            </h1>

            <OutputsCard

                config={config}
                setConfig={setConfig}

            />

            <InputsCard

                config={config}
                setConfig={setConfig}

            />

        </div>

    );

}