export default function StatusBar() {
  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">

      <h1 className="font-bold">
        SkyGrid Vendo
      </h1>

      <div className="flex items-center gap-2">

        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>

        <span className="text-sm">
          Connected
        </span>

      </div>

    </div>
  );
}