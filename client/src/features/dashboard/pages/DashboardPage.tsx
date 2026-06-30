import {
  DollarSign,
  Users,
  Monitor,
  Wifi,
} from "lucide-react";

import StatCard from "../../../components/admin/StatCard";
import RevenueChart from "../../../components/admin/RevenueChart";
import RecentTransactions from "../../../components/admin/RecentTransactions";
import MachineActivity from "../../../components/admin/MachineActivity";

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Welcome to SkyGrid Vendo OS
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

  <StatCard
    title="Revenue Today"
    value="₱5,250"
    icon={<DollarSign size={28} />}
    subtitle="Updated just now"
    trend="+12%"
  />

  <StatCard
    title="Connected Users"
    value="158"
    icon={<Users size={28} />}
    subtitle="Currently Online"
  />

  <StatCard
    title="Online Machines"
    value="42"
    icon={<Monitor size={28} />}
    subtitle="Across all vendors"
  />

  <StatCard
    title="Internet Status"
    value="ONLINE"
    icon={<Wifi size={28} />}
    subtitle="Fiber Connected"
  />

</div>
      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2">
          <RevenueChart />
        </div>

        <RecentTransactions />

      </div>

      <MachineActivity />

    </div>
  );
}