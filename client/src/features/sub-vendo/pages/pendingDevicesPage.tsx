import { useEffect, useState } from "react";
import { getPendingDevices } from "../services/subVendo.api";

export default function PendingDevicesPage() {

  const [devices, setDevices] = useState<any[]>([]);

  async function loadDevices() {
    try {
      const res = await getPendingDevices();

      setDevices(res.data);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Pending Devices
      </h1>

      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Chip ID
              </th>

              <th className="p-4 text-left">
                MAC Address
              </th>

              <th className="p-4 text-left">
                IP Address
              </th>

              <th className="p-4 text-left">
                Firmware
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {devices.map((device) => (

              <tr
                key={device.id}
                className="border-t"
              >

                <td className="p-4">
                  {device.chipId}
                </td>

                <td className="p-4">
                  {device.macAddress}
                </td>

                <td className="p-4">
                  {device.ipAddress}
                </td>

                <td className="p-4">
                  {device.firmwareVersion}
                </td>

                <td className="p-4">

                  <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">

                    {device.status}

                  </span>

                </td>

                <td className="p-4">

                  <button
                    className="px-4 py-2 rounded bg-sky-600 text-white"
                  >
                    Configure
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}