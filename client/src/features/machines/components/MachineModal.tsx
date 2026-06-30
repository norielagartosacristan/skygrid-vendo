import MachineForm from "./MachineForm";

interface Props{
    open:boolean;
    onClose:()=>void;
}

export default function MachineModal({
    open,
    onClose
}:Props){

    if(!open) return null;

    return(

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white rounded-3xl w-full max-w-xl p-8">

<div className="flex justify-between mb-6">

<h2 className="text-2xl font-bold">
Add Machine
</h2>

<button
onClick={onClose}
>
✕
</button>

</div>

<MachineForm/>

</div>

</div>

    )

}