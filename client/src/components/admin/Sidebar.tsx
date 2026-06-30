import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Monitor,
  Users,
  Package,
  Coins,
  Ticket,
  CreditCard,
  FileBarChart,
  Globe,
  Settings,
} from "lucide-react";

const menus = [
  { icon: LayoutDashboard, title: "Dashboard", path: "/admin" },
  { icon: Monitor, title: "Machines", path: "/admin/machines" },
  { icon: Users, title: "Vendors", path: "/admin/vendors" },
  { icon: Package, title: "Packages", path: "/admin/packages" },
  { icon: Coins, title: "Coin Settings", path: "/admin/coins" },
  { icon: Ticket, title: "Vouchers", path: "/admin/vouchers" },
  { icon: CreditCard, title: "Payments", path: "/admin/payments" },
  { icon: FileBarChart, title: "Reports", path: "/admin/reports" },
  { icon: Globe, title: "Portal CMS", path: "/admin/portal" },
  { icon: Settings, title: "Settings", path: "/admin/settings" },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-72 bg-slate-900 text-white flex-col">

      <div className="p-6 border-b border-slate-800">

        <h1 className="text-2xl font-bold">
          SkyGrid
        </h1>

        <p className="text-slate-400 text-sm">
          Vendo OS
        </p>

      </div>

      <nav className="flex-1 p-4">

       {menus.map((menu) => {
  const Icon = menu.icon;

  return (
    <NavLink
      key={menu.title}
      to={menu.path}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-xl transition mb-2 ${
          isActive
            ? "bg-sky-600 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      <Icon size={20} />

      <span>{menu.title}</span>

    </NavLink>
  );
})}

      </nav>

      <div className="p-4 border-t border-slate-800 text-sm text-slate-400">
        Version 1.0.0
      </div>

    </aside>
  );
}