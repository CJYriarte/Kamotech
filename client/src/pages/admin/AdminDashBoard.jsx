import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';


export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    pendingBookings: null,
    activePackages: null,
    installmentReviews: null,
    inquiriesToday: null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCounts = async () => {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const [bookings, packages, installments, inquiries] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('booking_status', 'pending'),
        supabase.from('packages').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('payment_installments').select('id', { count: 'exact', head: true }).eq('status', 'submitted'),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }).gte('created_at', startOfToday.toISOString()),
      ]);

      const firstError = [bookings, packages, installments, inquiries].find((r) => r.error);
      if (firstError) {
        setError(firstError.error.message);
        return;
      }

      setCounts({
        pendingBookings: bookings.count,
        activePackages: packages.count,
        installmentReviews: installments.count,
        inquiriesToday: inquiries.count,
      });
    };

    fetchCounts();
  }, []);

  const stats = [
    { title: 'Pending Bookings', value: counts.pendingBookings, color: 'border-amber-500' },
    { title: 'Active Packages', value: counts.activePackages, color: 'border-sky-primary' },
    { title: 'Installment Reviews', value: counts.installmentReviews, color: 'border-purple-500' },
    { title: 'Inquiries Today', value: counts.inquiriesToday, color: 'border-emerald-500' },
  ];

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-navy-main">Admin Operations Dashboard</h1>
        <p className="text-ink-secondary text-sm">Real-time tracking for bookings, packages, and payments.</p>
      </div>

      {error && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-xl border-l-4 shadow-soft ${s.color}`}>
            <p className="text-sm font-medium text-ink-secondary">{s.title}</p>
            <p className="text-3xl font-bold text-navy-main mt-1">
              {s.value === null ? '…' : s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-cyan-pale shadow-soft">
        <h2 className="text-lg font-bold text-navy-main mb-4">Quick Action Queue</h2>
        <div className="text-sm text-ink-secondary space-y-2">
          <p>• Review {counts.installmentReviews ?? '…'} pending installment receipt uploads</p>
          <p>• Update seat slot capacity for high-demand tour packages</p>
        </div>
      </div>

    </div>
  );
}