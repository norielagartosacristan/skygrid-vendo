import { useState } from "react";
import useNetworkSocket from "../hooks/useNetworkSocket";

import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  getInterfaces,
  deleteInterface,
} from "../services/networkInterface.api";

import InterfaceModal from "../components/InterfaceModal";

export default function InterfacesPage() {
  //const [interfaces, setInterfaces] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState<any>(null);

  const interfaces = useNetworkSocket();



  async function loadInterfaces() {
    try {
      setLoading(true);

      const res = await getInterfaces();

      // setInterfaces(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Delete this interface?"
    );

    if (!confirmDelete) return;

    try {

      await deleteInterface(id);

      loadInterfaces();

    } catch (err) {

      console.log(err);

    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Interfaces
          </h1>

          <p className="text-gray-500">
            Configure WAN, LAN and Wireless interfaces.
          </p>

        </div>

        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded-lg"
        >

          <Plus size={18} />

          Add Interface

        </button>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Display Name
              </th>

              <th className="text-left p-4">
                Interface
              </th>

              <th className="text-left p-4">
                Type
              </th>
              <th className="text-left p-4">
                Role
              </th>

              <th className="text-left p-4">
                IP Address
              </th>
              <th className="text-left p-4">MAC Address</th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-center p-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading && (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-8"
                >

                  Loading...

                </td>

              </tr>

            )}

            {!loading &&
              interfaces.length === 0 && (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >

                    No interfaces found.

                  </td>

                </tr>

              )}

           {interfaces.map((item) => (
  <tr
    key={item.id}
    className="border-t hover:bg-gray-50"
  >
    <td className="p-4">
      {item.displayName}
    </td>

    <td className="p-4">
      {item.name}
    </td>

    <td className="p-4">
      {item.role || "-"}
    </td>

    <td className="p-4">
      {item.type}
    </td>

    <td className="p-4">
      {item.ipAddress?.trim() || "-"}
    </td>

    <td className="p-4">
    {item.macAddress}
</td>

<td className="p-4">

    <span
        className={`inline-flex items-center gap-2 ${
            item.status === "UP"
                ? "text-green-600"
                : "text-red-600"
        }`}
    >

        {item.status === "UP"
            ? <CheckCircle size={18}/>
            : <XCircle size={18}/>
        }

        {item.status}

    </span>

</td>

    <td className="p-4">
      <div className="flex justify-center gap-3">

        <button
          onClick={() => {
            setSelected(item);
            setOpen(true);
          }}
          className="text-sky-600 hover:text-sky-800"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => handleDelete(item.id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={18} />
        </button>

      </div>
    </td>
  </tr>
))}
          </tbody>

        </table>

      </div>

      {/* Modal */}

      <InterfaceModal
        open={open}
        onClose={() => setOpen(false)}
        interfaceData={selected}
        onSaved={loadInterfaces}
      />

    </div>
  );
}