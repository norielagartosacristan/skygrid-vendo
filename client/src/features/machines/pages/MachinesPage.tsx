import { useState } from "react";

import MachineTable from "../components/MachineTable";
import MachineModal from "../components/MachineModal";

export default function MachinesPage(){

const [open,setOpen]=useState(false);

return(

<div className="space-y-6">

<div className="flex justify-between">

<div>

<h1 className="text-3xl font-bold">
Machines
</h1>

<p className="text-gray-500">
Manage your vendo machines.
</p>

</div>

<button
onClick={()=>setOpen(true)}
className="bg-sky-600 text-white px-5 py-3 rounded-xl"
>
+ Add Machine
</button>

</div>

<MachineTable/>

<MachineModal
open={open}
onClose={()=>setOpen(false)}
/>

</div>

)

}