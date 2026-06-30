import { Bell, UserCircle } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8 shadow-sm">

      <div>

        <h2 className="text-2xl font-bold">
          Dashboard
        </h2>

        <p className="text-gray-500">
          Welcome back, Administrator
        </p>

      </div>

      <div className="flex items-center gap-5">

        <button className="relative">

          <Bell />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            2
          </span>

        </button>

        <div className="flex items-center gap-3">

          <UserCircle size={38} />

          <div>

            <p className="font-semibold">
              Admin
            </p>

            <p className="text-sm text-gray-500">
              Super Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}