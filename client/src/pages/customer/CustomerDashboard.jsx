import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Users, Wallet } from 'lucide-react';
import bgPackages from '../../assets/branding/bg-packages.png';

const BOOKING_STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
  completed: 'bg-sky-100 text-sky-700',
};


export default function CustomerDashboard() {
  const { profile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [installmentsByBooking, setInstallmentsByBooking] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);

    const { data: bookingRows } = await supabase
      .from('bookings')
      .select('*, packages(title, destination, category, duration_days)')
      .order('created_at', { ascending: false });

    setBookings(bookingRows || []);

    if (bookingRows && bookingRows.length > 0) {
      const bookingIds = bookingRows.map((b) => b.id);
      const { data: installmentRows } = await supabase
        .from('payment_installments')
        .select('*')
        .in('booking_id', bookingIds)
        .order('installment_number', { ascending: true });

      const grouped = {};
      (installmentRows || []).forEach((inst) => {
        if (!grouped[inst.booking_id]) grouped[inst.booking_id] = [];
        grouped[inst.booking_id].push(inst);
      });
      setInstallmentsByBooking(grouped);
    }

    setLoading(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingCount = bookings.filter((b) => b.travel_date >= today && b.booking_status !== 'cancelled').length;
  const pendingPaymentsCount = Object.values(installmentsByBooking)
    .flat()
    .filter((i) => i.status === 'pending' || i.status === 'submitted').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <div
        className="relative rounded-2xl overflow-hidden mb-8 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgPackages})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-navy-main/70 via-navy-main/40 to-transparent" />
        <div className="relative z-10 px-8 py-12">
          <h1 className="text-2xl font-bold text-white">Welcome back, {profile?.full_name || 'Traveler'} 👋</h1>
          <p className="text-white/90 text-sm mt-1">Ready for your next adventure?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-cyan-pale rounded-xl p-5 shadow-soft">
          <p className="text-xs text-ink-muted mb-1">Total Bookings</p>
          <p className="text-2xl font-bold text-navy-main">{bookings.length}</p>
        </div>

        <div className="bg-white border border-cyan-pale rounded-xl p-5 shadow-soft">
          <p className="text-xs text-ink-muted mb-1">Upcoming Trips</p>
          <p className="text-2xl font-bold text-navy-main">{upcomingCount}</p>
        </div>

        <div className="bg-white border border-cyan-pale rounded-xl p-5 shadow-soft">
          <p className="text-xs text-ink-muted mb-1">Pending Payments</p>
          <p className="text-2xl font-bold text-navy-main">{pendingPaymentsCount}</p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-navy-main mb-4">My Bookings</h2>

      {loading ? (
        <p className="text-sm text-ink-secondary">Loading your bookings…</p>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-cyan-pale rounded-xl p-8 text-center shadow-soft">
          <p className="text-ink-secondary text-sm mb-3">You haven't booked a trip yet.</p>
          <a href="/" className="text-sky-primary text-sm font-medium hover:underline">Browse packages →</a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const pkg = booking.packages;
            const installments = installmentsByBooking[booking.id] || [];
            const paidCount = installments.filter((i) => i.status === 'verified').length;

            return (
              <div key={booking.id} className="bg-white border border-cyan-pale rounded-xl p-5 shadow-soft">

                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-sky-primary text-xs font-semibold uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5" />
                      {pkg?.destination}
                    </div>
                    <h3 className="text-navy-main font-bold">{pkg?.title || 'Package'}</h3>
                  </div>

                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${BOOKING_STATUS_STYLES[booking.booking_status] || 'bg-cloud-200 text-ink-secondary'}`}>
                    {booking.booking_status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-ink-secondary mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {booking.travel_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {booking.pax_count} traveler{booking.pax_count === 1 ? '' : 's'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" /> ₱{Number(booking.total_amount).toLocaleString()} total
                  </span>
                </div>

                {installments.length > 0 && (
                  <div className="pt-3 border-t border-cyan-pale">
                    <p className="text-xs text-ink-secondary mb-2">
                      Payment progress: {paidCount} of {installments.length} installments verified
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      {installments.map((inst) => (
                        <span
                          key={inst.id}
                          className={`text-xs px-2 py-1 rounded-full ${
                            inst.status === 'verified' ? 'bg-emerald-100 text-emerald-700'
                            : inst.status === 'submitted' ? 'bg-sky-100 text-sky-700'
                            : inst.status === 'rejected' ? 'bg-rose-100 text-rose-700'
                            : 'bg-cloud-200 text-ink-secondary'
                          }`}
                        >
                          #{inst.installment_number}: ₱{Number(inst.amount_due).toLocaleString()} ({inst.status})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}