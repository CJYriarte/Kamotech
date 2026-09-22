import React, { useState, useEffect } from 'react';

import { Clock, MapPin, Heart, CalendarDays } from 'lucide-react';


export default function PackageCard({ pkg, onSelect, onToggleFavorite, isFavorite }) {

  const [timeLeft, setTimeLeft] = useState('');


  useEffect(() => {

    if (!pkg.expires_at) return;

    const interval = setInterval(() => {

      const now = new Date().getTime();

      const expiry = new Date(pkg.expires_at).getTime();

      const diff = expiry - now;

      if (diff <= 0) {

        setTimeLeft('Expired');

        clearInterval(interval);

      } else {

        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);

      }

    }, 1000);


    return () => clearInterval(interval);

  }, [pkg.expires_at]);

  const lowSlots = pkg.slots_remaining !== null && pkg.slots_remaining !== undefined && pkg.slots_remaining <= 5;

  const soldOut = pkg.slots_remaining !== null && pkg.slots_remaining !== undefined && pkg.slots_remaining <= 0;

  return (

    <div className={`bg-white rounded-2xl border border-cyan-pale overflow-hidden hover:shadow-softLg transition-all flex flex-col group shadow-soft ${soldOut ? 'opacity-60' : ''}`}>


      <div className="relative h-48 bg-cloud-100 flex items-center justify-center overflow-hidden">

        <span className="text-ink-muted font-medium z-0 group-hover:scale-105 transition-transform">

          [ {pkg.destination} Cover Image ]

        </span>

        {timeLeft && (

          <div className="absolute top-3 left-3 z-20 bg-brand-red/90 text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow">

            <Clock className="w-3.5 h-3.5 animate-pulse" />

            <span>Closes in: {timeLeft}</span>

          </div>

        )}

        <button

          onClick={(e) => { e.stopPropagation(); onToggleFavorite(pkg.id); }}

          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 text-ink-secondary hover:bg-white hover:text-brand-red transition-colors shadow-soft"

        >

          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-brand-red text-brand-red' : ''}`} />

        </button>

        {soldOut ? (

          <div className="absolute bottom-3 left-3 z-20 bg-ink-primary/90 text-white text-xs px-2.5 py-1 rounded-full font-bold">

            Sold Out

          </div>

        ) : lowSlots && (

          <div className="absolute bottom-3 left-3 z-20 bg-gold text-ink-primary text-xs px-2.5 py-1 rounded-full font-bold">

            Only {pkg.slots_remaining} slot{pkg.slots_remaining === 1 ? '' : 's'} left

          </div>

        )}

      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">

        <div>

          <div className="flex items-center gap-1.5 text-sky-primary text-xs font-semibold uppercase tracking-wider mb-1">

            <MapPin className="w-3.5 h-3.5" />

            <span>{pkg.destination}</span>

          </div>

          <h3 className="text-lg font-bold text-ink-primary mb-2 line-clamp-1">{pkg.title}</h3>

          <p className="text-ink-secondary text-sm mb-1 line-clamp-2">

            {pkg.description || `${pkg.duration_days}-day trip to ${pkg.destination}`}

          </p>

          <div className="flex items-center gap-3 text-xs text-ink-muted mt-2">

            <span>{pkg.duration_days} Days</span>

            {pkg.best_travel_months && (

              <span className="flex items-center gap-1">

                <CalendarDays className="w-3.5 h-3.5" /> {pkg.best_travel_months}

              </span>

            )}

          </div>

        </div>

        <div className="pt-4 border-t border-cyan-pale flex items-center justify-between mt-4">

          <div>

            <span className="text-xs text-ink-muted">Starting from</span>

            <p className="text-lg font-extrabold text-navy-main">

              ₱{Number(pkg.price_per_pax).toLocaleString()} <span className="text-xs text-ink-muted font-normal">/ pax</span>

            </p>

          </div>

          <button

            onClick={() => onSelect(pkg)}

            className="px-4 py-2 bg-white border border-sky-primary text-sky-primary hover:bg-cloud-100 text-sm font-semibold rounded-lg transition-colors"

          >
            View Details

          </button>

        </div>

      </div>

    </div>

  );
  
}