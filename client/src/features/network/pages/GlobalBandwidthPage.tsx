import { useEffect, useState } from "react";
import {
  getGlobalBandwidth,
  saveGlobalBandwidth,
} from "../services/globalBandwidth.api";

export default function GlobalBandwidthPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    downloadSpeed: 500,
    uploadSpeed: 500,

    reserveDownload: 50,
    reserveUpload: 50,

    burstEnabled: true,

    burstDownload: 30,
    burstUpload: 30,

    burstDuration: 10,

    mode: "SHARED",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await getGlobalBandwidth();

      if (res.data) {
        setForm(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await saveGlobalBandwidth(form);

      alert("Bandwidth settings saved!");

    } catch (err) {

      console.log(err);

      alert("Unable to save settings.");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold">
        Global Bandwidth
      </h1>

      <p className="text-gray-500 mb-8">
        Configure the total available internet bandwidth for this machine.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow border p-8 space-y-8"
      >

      <div>

<h2 className="text-xl font-semibold mb-5">
Internet Speed
</h2>

<div className="grid grid-cols-2 gap-6">

<div>

<label>Download (Mbps)</label>

<input
type="number"
className="w-full border rounded-lg p-3 mt-2"
value={form.downloadSpeed}
onChange={(e)=>
setForm({
...form,
downloadSpeed:Number(e.target.value),
})
}
/>

</div>

<div>

<label>Upload (Mbps)</label>

<input
type="number"
className="w-full border rounded-lg p-3 mt-2"
value={form.uploadSpeed}
onChange={(e)=>
setForm({
...form,
uploadSpeed:Number(e.target.value),
})
}
/>

</div>

</div>

</div>

<div>

<h2 className="text-xl font-semibold mb-5">
Reserved Bandwidth
</h2>

<div className="grid grid-cols-2 gap-6">

<div>

<label>Reserve Download</label>

<input
type="number"
className="w-full border rounded-lg p-3 mt-2"
value={form.reserveDownload}
onChange={(e)=>
setForm({
...form,
reserveDownload:Number(e.target.value),
})
}
/>

</div>

<div>

<label>Reserve Upload</label>

<input
type="number"
className="w-full border rounded-lg p-3 mt-2"
value={form.reserveUpload}
onChange={(e)=>
setForm({
...form,
reserveUpload:Number(e.target.value),
})
}
/>

</div>

</div>

</div>

<div>

<h2 className="text-xl font-semibold mb-5">
Burst Settings
</h2>

<div className="space-y-5">

<label className="flex items-center gap-3">

<input
type="checkbox"
checked={form.burstEnabled}
onChange={(e)=>
setForm({
...form,
burstEnabled:e.target.checked,
})
}
/>

Enable Burst

</label>

<div className="grid grid-cols-3 gap-6">

<input
type="number"
placeholder="Burst Download"
className="border rounded-lg p-3"
value={form.burstDownload}
onChange={(e)=>
setForm({
...form,
burstDownload:Number(e.target.value),
})
}
/>

<input
type="number"
placeholder="Burst Upload"
className="border rounded-lg p-3"
value={form.burstUpload}
onChange={(e)=>
setForm({
...form,
burstUpload:Number(e.target.value),
})
}
/>

<input
type="number"
placeholder="Burst Duration"
className="border rounded-lg p-3"
value={form.burstDuration}
onChange={(e)=>
setForm({
...form,
burstDuration:Number(e.target.value),
})
}
/>

</div>

</div>

</div>

<div>

<h2 className="text-xl font-semibold mb-5">
Bandwidth Mode
</h2>

<select
className="border rounded-lg p-3"
value={form.mode}
onChange={(e)=>
setForm({
...form,
mode:e.target.value,
})
}
>

<option value="SHARED">
Shared
</option>

<option value="DEDICATED">
Dedicated
</option>

</select>

</div>

<div className="pt-6">

<button
disabled={loading}
className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg font-semibold"
>

{loading
? "Saving..."
: "Save Settings"}

</button>

</div>

</form>

</div>

);
}