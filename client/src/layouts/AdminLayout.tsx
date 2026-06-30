import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex flex-1 flex-col">

        <Topbar />

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}