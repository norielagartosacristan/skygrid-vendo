import { useEffect, useState } from "react";
import { getPendingDevices } from "../services/subVendo.api";
import ConfigureDeviceModal from "./ConfigureDeviceModal";

export default function PendingDevicesTable() {
  const [devices, setDevices] = useState<any[]>([]);
 const [selectedDevice, setSelectedDevice] = useState<any>(null);
const [openModal, setOpenModal] = useState(false);

  async function loadDevices() {
    try {
      const res = await getPendingDevices();
      setDevices(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Chip ID</th>
            <th className="p-4 text-left">MAC Address</th>
            <th className="p-4 text-left">IP Address</th>
            <th className="p-4 text-left">Firmware</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {devices.map((device) => (
            <tr key={device.id} className="border-t">
              <td className="p-4">{device.chipId}</td>
              <td className="p-4">{device.macAddress}</td>
              <td className="p-4">{device.ipAddress}</td>
              <td className="p-4">{device.firmwareVersion}</td>
              <td className="p-4">
                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                  {device.status}
                </span>
              </td>

              <td className="p-4 text-center">
               <button
                onClick={() => {
                    setSelectedDevice(device);
                    setOpenModal(true);
                }}
                className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
                >
                Configure
                </button>
              </td>
            </tr>
          ))}

          {devices.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-10 text-gray-500">
                No pending devices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ConfigureDeviceModal
  open={openModal}
  device={selectedDevice}
  onClose={() => setOpenModal(false)}
/>
    </div>
    
  );
}