import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import SkyBotLauncher from './components/common/SkyBotLauncher';
import ExplorePage from './pages/customer/ExplorePage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import TripMatcherPage from './pages/customer/TripMatcherPage';
import SkyBotPage from './pages/customer/SkyBotPage';
import AdminSidebar from './components/admin/AdminSideBar';
import AdminDashboard from './pages/admin/AdminDashBoard';
import AdminPackagesPage from './pages/admin/AdminPackagesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';
import AdminFollowUpsPage from './pages/admin/AdminFollowUpsPage';
import ManageStaffPage from './pages/admin/ManageStaffPage';
import MyToursPage from './pages/admin/MyToursPage';
import LoginPage from './pages/auth/LoginPage';
import StaffLoginPage from './pages/auth/StaffLoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

const STAFF_ROLES = ['junior_csr', 'senior_csr', 'tour_coordinator', 'tour_guide', 'admin'];

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <SkyBotLauncher />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<StaffLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route element={<CustomerLayout />}>
            <Route path="/" element={<ExplorePage />} />
            <Route path="/packages" element={<ExplorePage />} />
            <Route path="/trip-matcher" element={<TripMatcherPage />} />
            <Route path="/chat" element={<SkyBotPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<CustomerDashboard />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={STAFF_ROLES} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/packages" element={<AdminPackagesPage />} />
              <Route path="/admin/bookings" element={<AdminBookingsPage />} />
              <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
              <Route path="/admin/follow-ups" element={<AdminFollowUpsPage />} />
              <Route path="/admin/my-tours" element={<MyToursPage />} />
              <Route path="/admin/staff" element={<ManageStaffPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}