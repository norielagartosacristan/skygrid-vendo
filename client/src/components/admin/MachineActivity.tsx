import StatusBadge from "./StatusBadge";

const machines = [
  {
    id: 1,
    name: "Main Office",
    status: "ONLINE",
    users: 23,
  },
  {
    id: 2,
    name: "Barangay 1",
    status: "ONLINE",
    users: 18,
  },
  {
    id: 3,
    name: "Barangay 2",
    status: "OFFLINE",
    users: 0,
  },
];

export default function MachineActivity() {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-6">
        Machine Status
      </h2>

      <div className="space-y-5">

        {machines.map((machine) => (

          <div
            key={machine.id}
            className="flex justify-between items-center border-b pb-4"
          >

            <div>

              <p className="font-semibold">
                {machine.name}
              </p>

              <p className="text-sm text-gray-500">
                {machine.users} Active Users
              </p>

            </div>

            <StatusBadge
              status={machine.status as "ONLINE" | "OFFLINE" | "WARNING"}
            />

          </div>

        ))}

      </div>

    </div>
  );
}