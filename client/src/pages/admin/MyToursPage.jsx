import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Users } from 'lucide-react';


export default function MyToursPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMyTours();
  }, [user]);

  const fetchMyTours = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*, packages(title, destination), customer:profiles!bookings_customer_id_fkey(full_name, contact_number)')
      .eq('assigned_guide_id', user.id)
      .order('travel_date', { ascending: true });
    setBookings(data || []);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-navy-main">My Assigned Tours</h1>
        <p className="text-ink-secondary text-sm">Bookings you've been assigned to guide.</p>
      </div>

      {loading ? (
        <p className="text-sm text-ink-secondary">Loading…</p>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-cyan-pale rounded-xl p-8 text-center shadow-soft">
          <p className="text-ink-secondary text-sm">No tours assigned to you yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border border-cyan-pale rounded-xl p-5 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-sky-primary text-xs font-semibold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  {b.packages?.destination}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 capitalize">
                  {b.booking_status}
                </span>
              </div>
              <h3 className="font-bold text-navy-main mb-2">{b.packages?.title}</h3>
              <div className="flex flex-wrap gap-4 text-xs text-ink-secondary mb-2">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {b.travel_date}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {b.pax_count} traveler{b.pax_count === 1 ? '' : 's'}</span>
              </div>
              <p className="text-xs text-ink-muted">Customer: {b.customer?.full_name} • {b.customer?.contact_number}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}