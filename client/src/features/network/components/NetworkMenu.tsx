import { NavLink } from "react-router-dom";

const menus = [
  {
    name: "General",
    path: "/admin/network",
  },
  {
    name: "Global Bandwidth",
    path: "/admin/network/bandwidth",
  },
  {
    name: "Client Control",
    path: "/admin/network/client-control",
  },
  {
    name: "Interfaces",
    path: "/admin/network/interfaces",
  },
  {
    name: "VLANs",
    path: "/admin/network/vlans",
  },
  {
    name: "PPPoE",
    path: "/admin/network/pppoe",
  },
];

export default function NetworkMenu() {
  return (
    <aside className="w-72 bg-white rounded-xl border shadow-sm p-4">

      <h2 className="text-xl font-bold mb-5">
        Network
      </h2>

      <div className="space-y-2">

        {menus.map((menu) => (

          <NavLink
            key={menu.path}
            to={menu.path}
            end={menu.path === "/admin/network"}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`
            }
          >
            {menu.name}
          </NavLink>

        ))}

      </div>

    </aside>
  );
}