import type { Dispatch, SetStateAction } from "react";

interface Option{

label:string;

value:string;

}

interface Props{

label:string;

field:string;

value:string;

options:Option[];

config:any;

setConfig:Dispatch<SetStateAction<any>>;

}

export default function SelectInput({

label,

field,

value,

options,

config,

setConfig,

}:Props){

return(

<div>

<label className="block mb-2">

{label}

</label>

<select

className="w-full rounded-lg border p-2"

value={value}

onChange={(e)=>

setConfig({

...config,

[field]:e.target.value,

})

}

>

{

options.map((item)=>(

<option

key={item.value}

value={item.value}

>

{item.label}

</option>

))

}

</select>

</div>

);

}