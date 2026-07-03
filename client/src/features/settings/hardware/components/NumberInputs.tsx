import type { Dispatch, SetStateAction } from "react";

interface Props{

label:string;

field:string;

value:number;

config:any;

setConfig:Dispatch<SetStateAction<any>>;

}

export default function NumberInput({

label,

field,

value,

config,

setConfig

}:Props){

return(

<div>

<label className="block mb-2">

{label}

</label>

<input

type="number"

className="w-full rounded-lg border p-2"

value={value}

onChange={(e)=>

setConfig({

...config,

[field]:Number(e.target.value)

})

}

/>

</div>

);

}