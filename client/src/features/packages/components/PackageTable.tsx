import { Pencil, Trash2 } from "lucide-react";

const packages = [
  {
    id: 1,
    name: "Basic",
    price: 5,
    duration: "1 Hour",
    speed: "50 Mbps",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Premium",
    price: 10,
    duration: "3 Hours",
    speed: "100 Mbps",
    status: "ACTIVE",
  },
  {
    id: 3,
    name: "VIP",
    price: 20,
    duration: "1 Day",
    speed: "300 Mbps",
    status: "ACTIVE",
  },
];

export default function PackageTable() {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="p-4 text-left">Price</th>

            <th className="p-4 text-left">Name</th>

            <th className="p-4 text-left">Duration</th>

            <th className="p-4 text-left">Speed</th>

            <th className="p-4 text-left">Status</th>

            <th className="p-4 text-center">Action</th>

          </tr>

        </thead>

        <tbody>

          {packages.map((pkg) => (

            <tr key={pkg.id} className="border-t">

              <td className="p-4 font-semibold">
                ₱{pkg.price}
              </td>

              <td className="p-4">
                {pkg.name}
              </td>

              <td className="p-4">
                {pkg.duration}
              </td>

              <td className="p-4">
                {pkg.speed}
              </td>

              <td className="p-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {pkg.status}
                </span>
              </td>

              <td className="p-4">

                <div className="flex justify-center gap-3">

                  <button className="text-blue-600">
                    <Pencil size={18} />
                  </button>

                  <button className="text-red-600">
                    <Trash2 size={18} />
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