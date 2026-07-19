import { useEffect, useState } from "react";
import { configureDevice } from "../services/subVendo.api";
import { getAssignableInterfaces } from "../../network/services/networkInterface.api";

interface Props {
  open: boolean;
  device: any;
  onClose: () => void;
}

export default function ConfigureDeviceModal({
  open,
  device,
  onClose,
}: Props) {
  const [form, setForm] = useState({
    machineName: "",
    parentInterface: "",
    vlanId: 100,

    ipAddress: "",
    subnetMask: "255.255.255.0",
    gateway: "",

    clientStartIp: 100,
    clientEndIp: 254,

    bandwidthProfile: "20 Mbps",

    portal: "Default",

    enabled: true,
  });

const [interfaces, setInterfaces] = useState<any[]>([]);
useEffect(()=>{

    if(!open)
        return;

    loadInterfaces();

},[open]);


  if (!open) return null;

  async function handleSave() {

  if (!form.machineName.trim()) {
    alert("Machine Name is required.");
    return;
  }

  if (!device) return;

  try {

    // 👇 IDAGDAG MO ITO
    console.log("FORM =", form);
    console.log("Parent Interface:", form.parentInterface);

    console.log("SENDING =", {
      machineName: form.machineName,
      parentInterface: form.parentInterface,
      vlanId: form.vlanId,
      ipMode: "STATIC",
      ipAddressStatic: "10.0.0.1",
      subnetMask: form.subnetMask,
      gateway: form.gateway,
      dns1: "8.8.8.8",
      dns2: "1.1.1.1",
      clientStartIp: form.clientStartIp,
      clientEndIp: form.clientEndIp,
      bandwidthProfile: form.bandwidthProfile,
      portal: form.portal,
      enabled: true,
    });

    await configureDevice(device.id, {
      machineName: form.machineName,
      parentInterface: form.parentInterface,
      vlanId: form.vlanId,
      ipMode: "STATIC",
      ipAddressStatic: "10.0.0.1",
      subnetMask: form.subnetMask,
      gateway: form.gateway,
      dns1: "8.8.8.8",
      dns2: "1.1.1.1",
      clientStartIp: form.clientStartIp,
      clientEndIp: form.clientEndIp,
      bandwidthProfile: form.bandwidthProfile,
      portal: form.portal,
      enabled: true,
    });

    alert("Device configured successfully.");

    onClose();

  } catch (err) {
    console.error(err);
    alert("Unable to configure device.");
  }
}

async function loadInterfaces() {
  try {

    const res = await getAssignableInterfaces();

    console.log(res.data);

    setInterfaces(res.data);

    if (res.data.length > 0) {

      const iface = res.data[0];

      setForm(prev => ({
        ...prev,
        parentInterface: iface.name,
        vlanId: iface.vlanId ?? 0,
        ipAddress: iface.ipAddress ?? "",
        gateway: iface.gateway ?? "",
        subnetMask: iface.subnetMask ?? "255.255.255.0",
      }));

    }

  } catch (err) {
    console.error(err);
  }
}


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8">

        <h2 className="text-2xl font-bold mb-6">
          Configure Sub Vendo
        </h2>

        <div className="grid grid-cols-2 gap-5">

          <div>
            <label>Machine Name</label>

            <input
              className="w-full border rounded-lg p-2 mt-1"
              value={form.machineName}
              onChange={(e) =>
                setForm({
                  ...form,
                  machineName: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label>Parent Interface</label>

          <select
            className="w-full border rounded-lg p-2 mt-1"
            value={form.parentInterface}
            onChange={(e) => {
              const iface = interfaces.find(
                (i: any) => i.name === e.target.value
              );

              if (!iface) return;

              setForm((prev) => ({
                ...prev,
                parentInterface: iface.name,
                vlanId: iface.vlanId ?? 0,
                gateway: iface.gateway ?? "",
                subnetMask: iface.subnetMask ?? "255.255.255.0",
              }));
            }}
          >
            {interfaces.map((iface: any) => (
              <option key={iface.id} value={iface.name}>
                {iface.displayName}
              </option>
            ))}
          </select>
          </div>

          <div>
            <label>VLAN ID</label>

            <input
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              value={form.vlanId}
              onChange={(e) =>
                setForm({
                  ...form,
                  vlanId: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label>IP Address</label>

            <input
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
              value={form.ipAddress}
              readOnly
            />
          </div>

          <div>
            <label>Gateway</label>

            <input
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
              value={form.gateway}
              readOnly
            />
          </div>

          <div>
            <label>Subnet Mask</label>

            <input
              className="w-full border rounded-lg p-2 mt-1"
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
            <label>Client Start IP</label>

            <input
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              value={form.clientStartIp}
              onChange={(e) =>
                setForm({
                  ...form,
                  clientStartIp: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label>Client End IP</label>

            <input
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              value={form.clientEndIp}
              onChange={(e) =>
                setForm({
                  ...form,
                  clientEndIp: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label>Portal</label>

            <select
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option>Default</option>
            </select>
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
          onClick={handleSave}
          className="px-5 py-2 rounded-lg bg-sky-600 text-white"
        >
          Save
        </button>

        </div>

      </div>

    </div>
  );
}