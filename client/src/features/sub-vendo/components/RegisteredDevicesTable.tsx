import { useEffect, useState } from "react";
import { getRegisteredDevices } from "../services/subVendo.api";

export default function RegisteredDevicesTable() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDevices() {
    try {
      const res = await getRegisteredDevices();
      setDevices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDevices();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border p-10 text-center">
        Loading registered devices...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">

      <div className="p-5 border-b">
        <h2 className="text-xl font-bold">
          Registered Devices
        </h2>

        <p className="text-gray-500 text-sm">
          Configured Sub Vendo Machines
        </p>
      </div>

      {devices.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          No registered devices found.
        </div>
      ) : (
        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Machine</th>
              <th className="text-left p-3">MAC Address</th>
              <th className="text-left p-3">Parent</th>
              <th className="text-left p-3">VLAN</th>
              <th className="text-left p-3">IP Address</th>
              <th className="text-left p-3">Bandwidth</th>
              <th className="text-left p-3">Last Seen</th>
              <th className="text-left p-3">Status</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            {devices.map((device) => (

              <tr
                key={device.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-3 font-medium">
                  {device.machineName || "-"}
                </td>

                <td className="p-3">
                  {device.macAddress}
                </td>

                <td className="p-3">
                  {device.parentInterface}
                </td>

                <td className="p-3">
                  {device.vlanId}
                </td>

                <td className="p-3">
                  {device.ipAddressStatic}
                </td>

                <td className="p-3">
                  {device.bandwidthProfile}
                </td>

                <td className="p-3 text-sm">

  {device.lastSeen
    ? new Date(device.lastSeen).toLocaleString()
    : "-"}

</td>
<td className="p-3">

  {device.enabled ? (

    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
      🟢 Online
    </span>

  ) : (

    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
      🔴 Offline
    </span>

  )}

</td>

                <td className="p-3">

  <div className="flex gap-2 justify-center">

    <button
      className="px-3 py-1 rounded bg-sky-600 text-white hover:bg-sky-700"
    >
      Edit
    </button>

    <button
      className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
    >
      Restart
    </button>

    <button
      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
    >
      Delete
    </button>

  </div>

</td>

              </tr>

            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}