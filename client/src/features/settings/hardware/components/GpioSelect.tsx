import type { Dispatch, SetStateAction } from "react";

const gpioOptions = [
  { label: "GPIO0 (D3)", value: 0 },
  { label: "GPIO2 (D4)", value: 2 },
  { label: "GPIO4 (D2)", value: 4 },
  { label: "GPIO5 (D1)", value: 5 },
  { label: "GPIO12 (D6)", value: 12 },
  { label: "GPIO13 (D7)", value: 13 },
  { label: "GPIO14 (D5)", value: 14 },
  { label: "GPIO15 (D8)", value: 15 },
];

interface Props {

    label: string;

    value: number;

    field: string;

    config: any;

    setConfig: Dispatch<SetStateAction<any>>;

}

export default function GpioSelect({

    label,
    value,
    field,
    config,
    setConfig,

}: Props) {

    return (

        <div>

            <label className="block text-sm font-medium mb-2">
                {label}
            </label>

            <select

                className="w-full rounded-lg border p-2"

                value={value}

                onChange={(e)=>

                    setConfig({

                        ...config,

                        [field]: Number(e.target.value)

                    })

                }

            >

                {

                    gpioOptions.map((gpio)=>(

                        <option

                            key={gpio.value}

                            value={gpio.value}

                        >

                            {gpio.label}

                        </option>

                    ))

                }

            </select>

        </div>

    );

}