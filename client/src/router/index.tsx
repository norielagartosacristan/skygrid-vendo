import { BrowserRouter, Routes, Route } from "react-router-dom";

// Portal
import Home from "../pages/portal/Home";

// Layout
import AdminLayout from "../layouts/AdminLayout";

// Auth
import LoginPage from "../features/auth/pages/LoginPage";

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

export default function Router() {
  return (
    <BrowserRouter>
  <Routes>

    {/* Portal */}
    <Route path="/" element={<Home />} />

    {/* Login */}
    <Route
      path="/admin"
      element={<LoginPage />}
    />

    {/* Protected Admin */}
    <Route path="/admin" element={<AdminLayout />}>

      <Route
        path="dashboard"
        element={<DashboardPage />}
      />

      <Route
        path="packages"
        element={<PackagesPage />}
      />

      <Route
        path="machines"
        element={<MachinesPage />}
      />

      <Route
        path="vendors"
        element={<VendorsPage />}
      />

      <Route
        path="reports"
        element={<ReportsPage />}
      />

      <Route
        path="payments"
        element={<PaymentsPage />}
      />

      <Route
        path="vouchers"
        element={<VouchersPage />}
      />

      <Route
        path="settings"
        element={<SettingsPage />}
      />

    </Route>

  </Routes>
</BrowserRouter>
  );
}