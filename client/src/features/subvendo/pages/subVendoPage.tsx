import { useState } from "react";
import PendingDevicesTable from "../components/PendingDevicesTable";
import RegisteredDevicesTable from "../components/RegisteredDevicesTable";

export default function SubVendoPage() {
  const [tab, setTab] = useState<"registered" | "pending">("registered");

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Sub Vendo
        </h1>

        <p className="text-gray-500">
          Manage all detected and registered Sub Vendo devices.
        </p>

      </div>

      {/* Tabs */}

      <div className="flex gap-2">

         <button
          onClick={() => setTab("registered")}
          className={`px-5 py-2 rounded-lg ${
            tab === "registered"
              ? "bg-sky-600 text-white"
              : "bg-white border"
          }`}
        >
          Registered Devices
        </button>


        <button
          onClick={() => setTab("pending")}
          className={`px-5 py-2 rounded-lg ${
            tab === "pending"
              ? "bg-sky-600 text-white"
              : "bg-white border"
          }`}
        >
          Pending Devices
        </button>

      </div>
      {tab === "registered" && <RegisteredDevicesTable />}
      {tab === "pending" && <PendingDevicesTable />}

    </div>
  );
}