import GpioSelect from "./GpioSelect";

export default function InputsCard({

config,

setConfig

}:any){

return(

<div className="rounded-xl border bg-white p-6">

<h2 className="text-xl font-semibold mb-6">

Inputs

</h2>

<div className="space-y-5">

<GpioSelect

label="Coin Acceptor"

field="coinPin"

value={config.coinPin}

config={config}

setConfig={setConfig}

/>

<GpioSelect

label="Reset Button"

field="resetPin"

value={config.resetPin}

config={config}

setConfig={setConfig}

/>

</div>

</div>

);

}