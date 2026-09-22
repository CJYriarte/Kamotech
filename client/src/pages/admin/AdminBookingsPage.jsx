import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';


const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
  completed: 'bg-sky-100 text-sky-700',
  fully_paid: 'bg-emerald-100 text-emerald-700',
  partial: 'bg-amber-100 text-amber-700',
  verified: 'bg-emerald-100 text-emerald-700',
  submitted: 'bg-sky-100 text-sky-700',
  rejected: 'bg-rose-100 text-rose-700',
};


export default function AdminBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [installmentsByBooking, setInstallmentsByBooking] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, packages(title, destination), profiles(full_name, contact_number)')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const toggleExpand = async (booking) => {
    if (expandedId === booking.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(booking.id);

    if (!installmentsByBooking[booking.id]) {
      const { data } = await supabase
        .from('payment_installments')
        .select('*')
        .eq('booking_id', booking.id)
        .order('installment_number', { ascending: true });
      setInstallmentsByBooking((prev) => ({ ...prev, [booking.id]: data || [] }));
    }
  };

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    const { error } = await supabase.from('bookings').update({ booking_status: newStatus }).eq('id', bookingId);
    if (error) setError(error.message);
    else fetchBookings();
  };

  const handleInstallmentAction = async (installment, action) => {
    const payload = action === 'verified'
      ? { status: 'verified', verified_at: new Date().toISOString(), verified_by: user.id }
      : { status: 'rejected', verified_at: new Date().toISOString(), verified_by: user.id };

    const { error } = await supabase.from('payment_installments').update(payload).eq('id', installment.id);
    if (error) {
      setError(error.message);
      return;
    }
    const { data } = await supabase
      .from('payment_installments')
      .select('*')
      .eq('booking_id', installment.booking_id)
      .order('installment_number', { ascending: true });
    setInstallmentsByBooking((prev) => ({ ...prev, [installment.booking_id]: data || [] }));
  };

  const filtered = statusFilter === 'all' ? bookings : bookings.filter((b) => b.booking_status === statusFilter);

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-navy-main">Booking Tracking</h1>
        <p className="text-ink-secondary text-sm">Review bookings and verify payment installments.</p>
      </div>

      <div className="flex gap-2">
        {['all', ...BOOKING_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
              statusFilter === s ? 'bg-sky-primary text-white' : 'bg-white border border-cyan-pale text-ink-secondary hover:border-sky-primary'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="bg-white rounded-xl border border-cyan-pale shadow-soft overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-ink-secondary">Loading bookings…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-ink-secondary">No bookings match this filter.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-cloud-100 text-ink-secondary text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Package</th>
                <th className="px-4 py-3 font-medium">Travel Date</th>
                <th className="px-4 py-3 font-medium">Pax</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-pale">
              {filtered.map((booking) => (
                <React.Fragment key={booking.id}>
                  <tr className="hover:bg-cloud-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy-main">{booking.profiles?.full_name || '—'}</p>
                      <p className="text-xs text-ink-muted">{booking.profiles?.contact_number || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">
                      {booking.packages?.title}
                      <p className="text-xs text-ink-muted">{booking.packages?.destination}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">{booking.travel_date}</td>
                    <td className="px-4 py-3 text-ink-secondary">{booking.pax_count}</td>
                    <td className="px-4 py-3 text-ink-secondary">₱{Number(booking.total_amount).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_STYLES[booking.payment_status] || 'bg-cloud-200 text-ink-secondary'}`}>
                        {booking.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={booking.booking_status}
                        onChange={(e) => handleBookingStatusChange(booking.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1.5 rounded-lg border border-cyan-pale capitalize ${STATUS_STYLES[booking.booking_status] || ''}`}
                      >
                        {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => toggleExpand(booking)} className="text-sky-primary text-xs font-medium hover:underline">
                        {expandedId === booking.id ? 'Hide' : 'Installments'}
                      </button>
                    </td>
                  </tr>

                  {expandedId === booking.id && (
                    <tr>
                      <td colSpan={8} className="bg-cloud-50 px-4 py-4">
                        {!installmentsByBooking[booking.id] ? (
                          <p className="text-xs text-ink-secondary">Loading installments…</p>
                        ) : installmentsByBooking[booking.id].length === 0 ? (
                          <p className="text-xs text-ink-secondary">No installments recorded.</p>
                        ) : (
                          <div className="space-y-2">
                            {installmentsByBooking[booking.id].map((inst) => (
                              <div key={inst.id} className="flex items-center justify-between bg-white border border-cyan-pale rounded-lg px-4 py-2">
                                <div className="text-xs text-ink-secondary">
                                  <span className="font-semibold">#{inst.installment_number}</span> — ₱{Number(inst.amount_due).toLocaleString()} due {inst.due_date}
                                  {inst.proof_of_payment_url ? (
                                    <a href={inst.proof_of_payment_url} target="_blank" rel="noreferrer" className="ml-2 text-sky-primary hover:underline">View proof</a>
                                  ) : (
                                    <span className="ml-2 text-ink-muted">No proof uploaded yet</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_STYLES[inst.status] || 'bg-cloud-200 text-ink-secondary'}`}>
                                    {inst.status}
                                  </span>
                                  {(inst.status === 'submitted' || inst.status === 'pending') && (
                                    <>
                                      <button
                                        onClick={() => handleInstallmentAction(inst, 'verified')}
                                        className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg"
                                      >
                                        Verify
                                      </button>
                                      <button
                                        onClick={() => handleInstallmentAction(inst, 'rejected')}
                                        className="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}