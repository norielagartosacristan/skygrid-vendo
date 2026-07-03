import type { Dispatch, SetStateAction } from "react";

interface Props {

  label: string;

  field: string;

  value: boolean;

  config: any;

  setConfig: Dispatch<SetStateAction<any>>;

}

export default function ToggleSwitch({

  label,

  field,

  value,

  config,

  setConfig,

}: Props) {

  return (

    <label className="flex items-center justify-between">

      <span>{label}</span>

      <input

        type="checkbox"

        checked={value}

        onChange={(e)=>

          setConfig({

            ...config,

            [field]:e.target.checked,

          })

        }

      />

    </label>

  );

}