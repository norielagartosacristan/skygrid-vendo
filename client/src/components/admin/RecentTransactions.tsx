const transactions = [
  {
    id: 1,
    machine: "Machine-01",
    amount: "₱20",
    time: "2 mins ago",
  },
  {
    id: 2,
    machine: "Machine-03",
    amount: "₱10",
    time: "5 mins ago",
  },
  {
    id: 3,
    machine: "Machine-07",
    amount: "₱5",
    time: "10 mins ago",
  },
];

export default function RecentTransactions() {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-5">
        Recent Transactions
      </h2>

      <div className="space-y-4">

        {transactions.map((item) => (

          <div
            key={item.id}
            className="flex justify-between border-b pb-3"
          >

            <div>

              <p className="font-semibold">
                {item.machine}
              </p>

              <p className="text-sm text-gray-500">
                {item.time}
              </p>

            </div>

            <p className="font-bold text-green-600">
              {item.amount}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}