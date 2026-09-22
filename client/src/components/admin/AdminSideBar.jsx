import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/branding/logo.png';


const ROLE_LABELS = {
  customer: 'Customer',
  junior_csr: 'Junior CSR',
  senior_csr: 'Senior CSR',
  tour_coordinator: 'Tour Coordinator',
  tour_guide: 'Tour Guide',
  admin: 'Admin',
};


export default function AdminSidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Manage Packages', path: '/admin/packages', icon: '🧳' },
    { label: 'Booking Tracking', path: '/admin/bookings', icon: '📋' },
    { label: 'Inquiries (Gemini)', path: '/admin/inquiries', icon: '💬' },
    { label: 'Follow-Ups', path: '/admin/follow-ups', icon: '📌' },
  ];

  return (
    <aside className="w-64 bg-navy-main text-white min-h-screen p-4 flex flex-col justify-between">

      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          <img src={logo} alt="SkySurfers" className="h-9 w-auto" />
          <span className="font-bold text-sm tracking-wide">Portal</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-primary text-white'
                    : 'text-cyan-pale hover:bg-navy-deep hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-navy-deep pt-4 px-2 text-xs text-cyan-light">
        Logged in as:{' '}
        <span className="text-white font-semibold">
          {profile ? `${profile.full_name} (${ROLE_LABELS[profile.role] || profile.role})` : '…'}
        </span>
      </div>

    </aside>
  );
}