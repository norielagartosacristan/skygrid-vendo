import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "../../../components/admin/StatusBadge";
import type { Machine } from "../types";

const machines: Machine[] = [
  {
    id: 1,
    name: "Main Office",
    ip: "10.0.0.1",
    mac: "E4:5F:01:AA:12:11",
    vendor: "SkyGrid",
    location: "Office",
    status: "ONLINE",
  },
  {
    id: 2,
    name: "Store #1",
    ip: "10.0.0.2",
    mac: "E4:5F:01:AA:12:22",
    vendor: "Juan",
    location: "Market",
    status: "OFFLINE",
  },
];

export default function MachineTable() {
  return (
    <div className="bg-white rounded-3xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="p-4 text-left">Machine</th>
            <th className="p-4 text-left">IP</th>
            <th className="p-4 text-left">MAC</th>
            <th className="p-4 text-left">Vendor</th>
            <th className="p-4 text-left">Location</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Action</th>

          </tr>

        </thead>

        <tbody>

          {machines.map(machine => (

            <tr key={machine.id} className="border-t">

              <td className="p-4">{machine.name}</td>

              <td className="p-4">{machine.ip}</td>

              <td className="p-4">{machine.mac}</td>

              <td className="p-4">{machine.vendor}</td>

              <td className="p-4">{machine.location}</td>

              <td className="p-4">
                <StatusBadge
                  status={machine.status}
                />
              </td>

              <td className="p-4">

                <div className="flex justify-center gap-3">

                  <button>
                    <Pencil size={18}/>
                  </button>

                  <button>
                    <Trash2 size={18}/>
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}