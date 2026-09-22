import React from 'react';
import { X, CheckCircle, XCircle, CalendarDays, Users } from 'lucide-react';


export default function PackageDetailModal({ pkg, onClose, onBook }) {
  if (!pkg) return null;

  const itineraryLines = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];
  const soldOut = pkg.slots_remaining !== null && pkg.slots_remaining !== undefined && pkg.slots_remaining <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-main/50 backdrop-blur-sm">
      <div className="bg-white border border-cyan-pale rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-softLg">

        <div className="relative h-56 bg-cloud-100 flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full text-ink-secondary hover:text-brand-red transition-colors z-10 shadow-soft"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-ink-muted font-medium">[ High-Res Travel Showcase ]</span>
        </div>

        <div className="p-6 space-y-6">

          <div>
            <span className="text-xs font-bold text-sky-primary tracking-wider uppercase">{pkg.category} Package</span>
            <h2 className="text-2xl font-bold text-navy-main">{pkg.title}</h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-secondary text-sm mt-1">
              <span>{pkg.destination} • {pkg.duration_days} Days</span>

              {pkg.best_travel_months && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" /> Best: {pkg.best_travel_months}
                </span>
              )}

              {pkg.slots_remaining !== null && pkg.slots_remaining !== undefined && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {pkg.slots_remaining} slot{pkg.slots_remaining === 1 ? '' : 's'} remaining
                </span>
              )}
            </div>
          </div>

          {pkg.description && (
            <p className="text-ink-secondary text-sm leading-relaxed">{pkg.description}</p>
          )}

          {itineraryLines.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-sky-primary mb-2">Itinerary</h4>

              <ol className="text-sm text-ink-secondary space-y-1.5 list-decimal list-inside">
                {itineraryLines.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <h4 className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4" /> Inclusions
              </h4>

              <ul className="text-xs text-ink-secondary space-y-1">
                {Array.isArray(pkg.inclusions) && pkg.inclusions.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
              <h4 className="text-sm font-semibold text-rose-600 flex items-center gap-1.5 mb-2">
                <XCircle className="w-4 h-4" /> Exclusions
              </h4>

              <ul className="text-xs text-ink-secondary space-y-1">
                {Array.isArray(pkg.exclusions) && pkg.exclusions.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

          </div>

          <div className="bg-cloud-100 border border-cyan-pale p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-ink-muted">Total Price</span>
              <p className="text-2xl font-black text-navy-main">₱{Number(pkg.price_per_pax).toLocaleString()}</p>
            </div>

            <button
              onClick={() => !soldOut && onBook(pkg)}
              disabled={soldOut}
              className={`px-6 py-3 font-bold rounded-xl transition-all ${
                soldOut
                  ? 'bg-cloud-200 text-ink-muted cursor-not-allowed'
                  : 'bg-brand-red hover:bg-brand-redDeep text-white shadow-soft'
              }`}
            >
              {soldOut ? 'Sold Out' : 'Book Package Now'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}