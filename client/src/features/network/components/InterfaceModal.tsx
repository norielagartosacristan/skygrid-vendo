import { useEffect, useState } from "react";
import {
  createInterface,
  updateInterface,
} from "../services/networkInterface.api";

type Props = {
  open: boolean;
  onClose: () => void;
  interfaceData?: any;
  onSaved: () => void;
};

export default function InterfaceModal({
  open,
  onClose,
  interfaceData,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [physicalInterfaces, setPhysicalInterfaces] =
useState<any[]>([]);

  const [form, setForm] = useState({
    displayName: "",
    type: "VLAN",

    parentInterface: "",

    vlanId: 22,

    role: "LAN",

    enabled: true,

    ipMode: "STATIC",

    ipAddress: "",

    subnetMask: "255.255.255.0",

    gateway: "",

    dns1: "8.8.8.8",

    dns2: "1.1.1.1",

    mtu: 1500,
});

useEffect(() => {

    loadPhysicalInterfaces();

}, []);

async function loadPhysicalInterfaces() {

    try {

        const res = await getInterfaces();

        const items = res.data.filter((i:any)=>

            !i.name.includes(".")
        );

        setPhysicalInterfaces(items);

    } catch(err){

        console.log(err);

    }

}

useEffect(() => {
  if (form.type !== "VLAN") return;

  if (!form.parentInterface || !form.vlanId) return;

  setForm((prev) => ({
    ...prev,

    displayName: `VLAN${prev.vlanId}`,

    name: `${prev.parentInterface}.${prev.vlanId}`,

    ipAddress: "10.0.0.1",

    subnetMask: "255.255.255.0",
  }));
}, [
  form.parentInterface,
  form.vlanId,
  form.type,
]);


useEffect(() => {
  if (interfaceData) {
    setForm({
      displayName: interfaceData.displayName ?? "",
      type: interfaceData.type ?? "VLAN",
      parentInterface: interfaceData.parentInterface ?? "",
      vlanId: interfaceData.vlanId ?? 22,
      role: interfaceData.role ?? "LAN",
      enabled: interfaceData.enabled ?? true,
      ipMode: interfaceData.ipMode ?? "STATIC",
      ipAddress: interfaceData.ipAddress ?? "",
      subnetMask:
        interfaceData.subnetMask ?? "255.255.255.0",
      gateway: interfaceData.gateway ?? "",
      dns1: interfaceData.dns1 ?? "8.8.8.8",
      dns2: interfaceData.dns2 ?? "1.1.1.1",
      mtu: interfaceData.mtu ?? 1500,
    });
  } else {
    setForm({
      displayName: "",
      type: "VLAN",
      parentInterface: "",
      vlanId: 22,
      role: "LAN",
      enabled: true,
      ipMode: "STATIC",
      ipAddress: "",
      subnetMask: "255.255.255.0",
      gateway: "",
      dns1: "8.8.8.8",
      dns2: "1.1.1.1",
      mtu: 1500,
    });
  }
}, [interfaceData]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      if (interfaceData) {
        await updateInterface(
          interfaceData.id,
          form
        );
      } else {
        await createInterface(form);
      }

      onSaved();
      onClose();

    } catch (err) {

      console.log(err);
      alert("Unable to save interface.");

    } finally {

      setLoading(false);

    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8">

        <h2 className="text-2xl font-bold mb-6">

          {interfaceData
            ? "Edit Interface"
            : "Add Interface"}

        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="grid grid-cols-2 gap-5">

            <div>

<label>

Display Name

</label>

<input

readOnly

value={form.displayName}

className="w-full border rounded-lg p-3 bg-gray-100"

/>

</div>


          </div>

          <div className="grid grid-cols-2 gap-5">

            <div>

              <label className="block mb-2">
                Type
              </label>

              <select

              value={form.type}

              onChange={(e)=>

              setForm({

              ...form,

              type:e.target.value

              })

              }

              >

              <option value="ETHERNET">

              Ethernet

              </option>

              <option value="WIRELESS">

              Wireless

              </option>

              <option value="VLAN">

              VLAN

              </option>

              </select>

            </div>

            <div>

              <label className="block mb-2">
                IP Mode
              </label>

              <select
                className="w-full border rounded-lg p-3"
                value={form.ipMode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ipMode: e.target.value,
                  })
                }
              >

                <option value="DHCP">
                  DHCP
                </option>

                <option value="STATIC">
                  Static
                </option>

              </select>

            </div>

          </div>

          {form.ipMode === "STATIC" && (

            <div className="grid grid-cols-3 gap-5">

              <div>

                <label className="block mb-2">
                  IP Address
                </label>

                <input
                  className="w-full border rounded-lg p-3"
                  value={form.ipAddress}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ipAddress: e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="block mb-2">
                  Subnet Mask
                </label>

                <input
                  className="w-full border rounded-lg p-3"
                  value={form.subnetMask}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subnetMask: e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="block mb-2">
                  Gateway
                </label>

                <input
                  className="w-full border rounded-lg p-3"
                  value={form.gateway}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      gateway: e.target.value,
                    })
                  }
                />

              </div>

            </div>

          )}

          <div className="grid grid-cols-3 gap-5">

            <div>

              <label className="block mb-2">
                Primary DNS
              </label>

              <input
                className="w-full border rounded-lg p-3"
                value={form.dns1}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dns1: e.target.value,
                  })
                }
              />

            </div>

            <div>

              <label className="block mb-2">
                Secondary DNS
              </label>

              <input
                className="w-full border rounded-lg p-3"
                value={form.dns2}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dns2: e.target.value,
                  })
                }
              />

            </div>

            <div>

              <label className="block mb-2">
                MTU
              </label>

              <input
                type="number"
                className="w-full border rounded-lg p-3"
                value={form.mtu}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mtu: Number(e.target.value),
                  })
                }
              />

            </div>

          </div>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) =>
                setForm({
                  ...form,
                  enabled: e.target.checked,
                })
              }
            />

            Enable Interface

          </label>

          <div className="flex justify-end gap-3 pt-6">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg"
            >
              {loading
                ? "Saving..."
                : interfaceData
                ? "Update Interface"
                : "Save Interface"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}