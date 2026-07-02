import { Outlet } from "react-router-dom";
import NetworkMenu from "../components/NetworkMenu";

export default function NetworkLayout() {
  return (
    <div className="flex gap-6">

      <NetworkMenu />

      <div className="flex-1 bg-white rounded-xl border p-6 shadow-sm">
        <Outlet />
      </div>

    </div>
  );
}