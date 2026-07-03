import GpioSelect from "./GpioSelect";

export default function OutputsCard({

    config,
    setConfig

}: any){

return(

<div className="rounded-xl border bg-white p-6">

<h2 className="text-xl font-semibold mb-6">

Outputs

</h2>

<div className="space-y-5">

<GpioSelect

label="Main Relay"

field="relayPin"

value={config.relayPin}

config={config}

setConfig={setConfig}

/>

<GpioSelect

label="Status LED"

field="ledPin"

value={config.ledPin}

config={config}

setConfig={setConfig}

/>

<GpioSelect

label="Buzzer"

field="buzzerPin"

value={config.buzzerPin}

config={config}

setConfig={setConfig}

/>

</div>

</div>

);

}