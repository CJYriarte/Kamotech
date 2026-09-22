import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PackageCard from '../../components/customer/PackageCard';
import PackageDetailModal from '../../components/customer/PackageDetailModal';
import BookingModal from '../../components/customer/BookingModal';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import bgHome from '../../assets/branding/bg-home.png';

export default function ExplorePage() {
  const [packages, setPackages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalPkg, setActiveModalPkg] = useState(null);
  const [bookingPkg, setBookingPkg] = useState(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchPackages(); }, [selectedCategory]);
  useEffect(() => {
    if (user) fetchFavorites();
    else setFavoriteIds(new Set());
  }, [user]);

  const fetchPackages = async () => {
    let query = supabase.from('packages').select('*').eq('status', 'published').eq('is_active', true);
    if (selectedCategory !== 'all') query = query.eq('category', selectedCategory);
    const { data } = await query;
    setPackages(data || []);
  };

  const fetchFavorites = async () => {
    const { data } = await supabase.from('customer_favorites').select('package_id');
    setFavoriteIds(new Set((data || []).map((f) => f.package_id)));
  };

  const handleToggleFavorite = async (packageId) => {
    if (!user) { navigate('/login'); return; }
    const isCurrentlyFavorite = favoriteIds.has(packageId);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      isCurrentlyFavorite ? next.delete(packageId) : next.add(packageId);
      return next;
    });

    if (isCurrentlyFavorite) {
      const { error } = await supabase.from('customer_favorites').delete().eq('customer_id', user.id).eq('package_id', packageId);
      if (error) fetchFavorites();
    } else {
      const { error } = await supabase.from('customer_favorites').insert({ customer_id: user.id, package_id: packageId });
      if (error) fetchFavorites();
    }
  };

  const handleBookClick = (pkg) => {
    if (!user) { navigate('/login'); return; }
    setActiveModalPkg(null);
    setBookingPkg(pkg);
  };

  const handleBookingSuccess = (bookingId) => {
    setBookingPkg(null);
    setConfirmedBookingId(bookingId);
    fetchPackages();
  };

  return (
    <div className="min-h-screen bg-cloud-50">
      <section
        className="relative py-24 text-center px-4 border-b border-cyan-pale bg-cover bg-center"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-navy-main/20 via-navy-main/50 to-navy-main/70" />

        <h1 className="relative z-10 text-4xl md:text-5xl font-black text-white mb-4">
          Discover Extraordinary Journeys
        </h1>
        <p className="relative z-10 text-white/90 max-w-xl mx-auto text-base">
          Handcrafted pilgrimage tours, leisure escapes, and educational trips tailored for seamless travel.
        </p>

        <div className="relative z-10 flex flex-wrap justify-center gap-2 mt-8">
          {['all', 'domestic', 'international', 'cruise', 'educational'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-primary text-white shadow-soft'
                  : 'bg-white border border-cyan-pale text-ink-secondary hover:border-sky-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onSelect={setActiveModalPkg}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favoriteIds.has(pkg.id)}
            />
          ))}
        </div>
      </main>

      <PackageDetailModal pkg={activeModalPkg} onClose={() => setActiveModalPkg(null)} onBook={handleBookClick} />
      <BookingModal pkg={bookingPkg} onClose={() => setBookingPkg(null)} onSuccess={handleBookingSuccess} />

      {confirmedBookingId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-navy-main/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-softLg">
            <h2 className="text-lg font-bold text-navy-main mb-2">Booking Confirmed! 🎉</h2>
            <p className="text-ink-secondary text-sm mb-4">Booking ID: {confirmedBookingId}</p>
            <button
              onClick={() => setConfirmedBookingId(null)}
              className="w-full py-3 rounded-lg bg-brand-red hover:bg-brand-redDeep text-white font-bold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}