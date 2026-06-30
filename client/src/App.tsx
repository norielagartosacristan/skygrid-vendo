export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[380px]">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          SkyGrid Vendo
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Welcome
        </p>

        <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition">
          Insert Coin
        </button>
      </div>
    </div>
  );
}
