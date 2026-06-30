export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          SkyGrid Vendo
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Welcome
        </p>

        <div className="mt-8 space-y-4">

          <div className="bg-slate-100 rounded-xl p-4">

            <div className="flex justify-between">
              <span>₱5</span>
              <span>1 Hour</span>
            </div>

            <div className="flex justify-between mt-2">
              <span>₱10</span>
              <span>3 Hours</span>
            </div>

          </div>

          <div className="bg-blue-50 rounded-xl p-4">

            <div className="flex justify-between">
              <span>Balance</span>
              <span>₱0.00</span>
            </div>

            <div className="flex justify-between mt-2">
              <span>Remaining</span>
              <span>00:00:00</span>
            </div>

          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg"
          >
            Insert Coin
          </button>

        </div>

      </div>
    </div>
  );
}