import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  UserCircle,
  LogOut,
  Settings,
  User,
  ChevronDown,
} from "lucide-react";

export default function Topbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/admin");
};

  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8 shadow-sm">

      <div>
        <h2 className="text-2xl font-bold">
          Dashboard
        </h2>

        <p className="text-gray-500">
          Welcome back, {user.fullName || "Administrator"}
        </p>
      </div>

      <div className="flex items-center gap-6">

        {/* Notifications */}
        <button className="relative">

          <Bell />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            2
          </span>

        </button>

        {/* User Dropdown */}
        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
          >

            <UserCircle size={40} />

            <div className="text-left">

              <p className="font-semibold">
                {user.fullName || "Admin"}
              </p>

              <p className="text-sm text-gray-500">
                {user.role || "SUPER_ADMIN"}
              </p>

            </div>

            <ChevronDown size={18} />

          </button>

          {open && (

            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border overflow-hidden z-50">

              <button
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
              >
                <User size={18} />
                Profile
              </button>

              <button
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
              >
                <Settings size={18} />
                Settings
              </button>

              <hr />

             <button
  onClick={logout}
  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
>
  <LogOut size={18} />
  Logout
</button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}