import React, { useState } from 'react';

import { X } from 'lucide-react';

import { supabase } from '../../services/supabaseClient';

export default function BookingModal({ pkg, onClose, onSuccess }) {

  const [paxCount, setPaxCount] = useState(1);

  const [travelDate, setTravelDate] = useState('');

  const [installments, setInstallments] = useState(1);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');


  if (!pkg) return null;

  const total = Number(pkg.price_per_pax) * Number(paxCount || 0);

  const maxPax = pkg.slots_remaining ?? 20;

  const today = new Date().toISOString().split('T')[0];

  const handleConfirm = async () => {

    setError('');

    if (!travelDate) {

      setError('Please select a travel date.');

      return;

    }

    setLoading(true);

    const { data, error } = await supabase.rpc('create_booking', {

      p_package_id: pkg.id,

      p_pax_count: Number(paxCount),

      p_travel_date: travelDate,

      p_installment_count: Number(installments),

    });

    setLoading(false);

    if (error) {

      setError(error.message);

      return;

    }

    onSuccess(data);

  };

  return (

    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 text-white">

        <div className="flex items-center justify-between">

          <h2 className="text-lg font-bold">Book: {pkg.title}</h2>

          <button onClick={onClose} className="text-slate-400 hover:text-white">

            <X className="w-5 h-5" />

          </button>

        </div>

        <div className="space-y-3">

          <div>

            <label className="text-xs text-slate-400 block mb-1">Number of Travelers</label>

            <input

              type="number" min="1" max={maxPax} value={paxCount}

              onChange={(e) => setPaxCount(e.target.value)}

              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm"

            />

            {pkg.slots_remaining !== null && pkg.slots_remaining !== undefined && (

              <p className="text-xs text-slate-500 mt-1">{pkg.slots_remaining} slots currently available</p>

            )}

          </div>


          <div>

            <label className="text-xs text-slate-400 block mb-1">Travel Date</label>

            <input

              type="date" min={today} value={travelDate}

              onChange={(e) => setTravelDate(e.target.value)}

              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm"

            />

          </div>


          <div>

            <label className="text-xs text-slate-400 block mb-1">Payment Plan</label>

            <select

              value={installments} onChange={(e) => setInstallments(e.target.value)}

              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm"

            >

              {[1, 2, 3, 4, 5].map((n) => (

                <option key={n} value={n}>{n === 1 ? 'Pay in full' : `${n} installments`}</option>

              ))}

            </select>

          </div>

        </div>


        <div className="bg-sky-950/30 border border-sky-800/40 p-4 rounded-xl">

          <p className="text-xs text-slate-400">Total for {paxCount} traveler{paxCount == 1 ? '' : 's'}</p>

          <p className="text-2xl font-black text-sky-400">₱{total.toLocaleString()}</p>

          {installments > 1 && (

            <p className="text-xs text-slate-400 mt-1">~₱{(total / installments).toLocaleString(undefined, { maximumFractionDigits: 2 })} per installment</p>

          )}
        </div>



        {error && (

          <p className="text-xs text-rose-400 bg-rose-950/50 border border-rose-900 rounded-lg px-3 py-2">{error}</p>

        )}

        <button

          onClick={handleConfirm} disabled={loading}

          className="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm disabled:opacity-60"

        >

          {loading ? 'Booking…' : 'Confirm Booking'}

        </button>

      </div>

    </div>
    
  );

}