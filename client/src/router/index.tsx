import { BrowserRouter, Routes, Route } from "react-router-dom";

// Portal
import Home from "../pages/portal/Home";

// Layout
import AdminLayout from "../layouts/AdminLayout";

// Auth
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Dashboard
import DashboardPage from "../features/dashboard/pages/DashboardPage";

// Packages
import PackagesPage from "../features/packages/pages/PackagesPage";

// Machines
import MachinesPage from "../features/machines/pages/MachinesPage";

// Vendors
import VendorsPage from "../features/vendors/pages/VendorsPage";

// Reports
import ReportsPage from "../features/reports/pages/ReportsPage";

// Payments
import PaymentsPage from "../features/payments/pages/PaymentsPage";

// Vouchers
import VouchersPage from "../features/vouchers/pages/VouchersPage";

// Settings
import SettingsPage from "../features/settings/pages/SettingsPage";

import NetworkLayout from "../features/network/layouts/NetworkLayout";
import GeneralSettingsPage from "../features/network/pages/GeneralSettingsPage";
import GlobalBandwidthPage from "../features/network/pages/GlobalBandwidthPage";
import ClientControlPage from "../features/network/pages/ClientControlPage";
import InterfacesPage from "../features/network/pages/InterfacesPage";
import SubVendoPage from "../features/sub-vendo/pages/subVendoPage";
import HardwareSettings from "../features/settings/hardware";
//import VlansPage from "../features/network/pages/VlansPage";
//import PPPoEPage from "../features/network/pages/PPPoEPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Portal */}
        <Route path="/" element={<Home />} />

        {/* Login */}
        <Route path="/admin" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>

          <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="packages" element={<PackagesPage />} />
                <Route path="machines"  element={<MachinesPage />} />
                <Route  path="vendors"  element={<VendorsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route  path="payments" element={<PaymentsPage />} />
                <Route path="vouchers" element={<VouchersPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="network/general" element={<GeneralSettingsPage />} />
                <Route path="network/bandwidth" element={<GlobalBandwidthPage />} />
                <Route path="network/client-control" element={<ClientControlPage />} />
                <Route path="network/interfaces" element={<InterfacesPage />} />
                <Route path="sub-vendo" element={<SubVendoPage />} />
                <Route
                    path="/admin/settings/hardware"
                    element={<HardwareSettings />}
                />
                <Route
                    path="/admin/network/interfaces"
                    element={<InterfacesPage />}
                />
                <Route path="network" element={<NetworkLayout />}>
                    <Route index element={<GeneralSettingsPage />} />
                    <Route path="bandwidth" element={<GlobalBandwidthPage />} />
                    <Route path="client-control" element={<ClientControlPage />} />
                </Route>
          </Route>
        </Route> 
      </Routes>
    </BrowserRouter>
  );
}