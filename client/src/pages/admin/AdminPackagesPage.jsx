import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';


const CATEGORIES = ['domestic', 'international', 'cruise', 'educational'];

const EMPTY_FORM = {
  title: '', destination: '', category: 'domestic',
  price_per_pax: '', duration_days: '',
  description: '', best_travel_months: '', itinerary: '',
  total_slots: '', slots_remaining: '',
  inclusions: '', exclusions: '', is_active: true,
};


export default function AdminPackagesPage() {
  const { profile } = useAuth();
  const canManage = ['senior_csr', 'admin'].includes(profile?.role);

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [aiPolishing, setAiPolishing] = useState(false);
  const [aiNotice, setAiNotice] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setPackages(data);
    setLoading(false);
  };

  useEffect(() => { fetchPackages(); }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setAiNotice(false);
    setShowModal(true);
  };

  const openEditModal = (pkg) => {
    setEditingId(pkg.id);
    setForm({
      title: pkg.title,
      destination: pkg.destination,
      category: pkg.category,
      price_per_pax: pkg.price_per_pax,
      duration_days: pkg.duration_days,
      description: pkg.description || '',
      best_travel_months: pkg.best_travel_months || '',
      itinerary: (pkg.itinerary || []).join('\n'),
      total_slots: pkg.total_slots ?? '',
      slots_remaining: pkg.slots_remaining ?? '',
      inclusions: (pkg.inclusions || []).join('\n'),
      exclusions: (pkg.exclusions || []).join('\n'),
      is_active: pkg.is_active,
    });
    setAiNotice(false);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAiPolish = () => {
    if (!form.description.trim()) {
      setError('Type a rough description first, then click AI Polish.');
      return;
    }
    setError('');
    setAiPolishing(true);
    setAiNotice(false);

    setTimeout(() => {
      setAiPolishing(false);
      setAiNotice(true);
    }, 1200);
  };

  const buildPayload = (status) => ({
    title: form.title,
    destination: form.destination,
    category: form.category,
    price_per_pax: Number(form.price_per_pax),
    duration_days: Number(form.duration_days),
    description: form.description,
    best_travel_months: form.best_travel_months,
    itinerary: form.itinerary.split('\n').map((s) => s.trim()).filter(Boolean),
    total_slots: form.total_slots === '' ? null : Number(form.total_slots),
    slots_remaining: form.slots_remaining === '' ? (form.total_slots === '' ? null : Number(form.total_slots)) : Number(form.slots_remaining),
    inclusions: form.inclusions.split('\n').map((s) => s.trim()).filter(Boolean),
    exclusions: form.exclusions.split('\n').map((s) => s.trim()).filter(Boolean),
    is_active: status === 'published' ? true : form.is_active,
    status,
  });

  const submitWithStatus = async (status) => {
    setSaving(true);
    setError('');

    const payload = buildPayload(status);
    const { error } = editingId
      ? await supabase.from('packages').update(payload).eq('id', editingId)
      : await supabase.from('packages').insert(payload);

    setSaving(false);
    if (error) { setError(error.message); return; }

    setShowModal(false);
    fetchPackages();
  };

  const handleDelete = async (pkg) => {
    if (!window.confirm(`Delete "${pkg.title}"? This can't be undone.`)) return;
    const { error } = await supabase.from('packages').delete().eq('id', pkg.id);
    if (error) setError(error.message);
    else fetchPackages();
  };

  const toggleActive = async (pkg) => {
    const { error } = await supabase.from('packages').update({ is_active: !pkg.is_active }).eq('id', pkg.id);
    if (error) setError(error.message);
    else fetchPackages();
  };

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-main">Manage Packages</h1>
          <p className="text-ink-secondary text-sm">Create and update the travel packages customers can browse and book.</p>
        </div>
        {canManage && (
          <button onClick={openCreateModal} className="bg-brand-red hover:bg-brand-redDeep text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-soft">
            + New Package
          </button>
        )}
      </div>

      {!canManage && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Your role has view-only access to packages. Only Senior CSR and Admin can create, edit, or delete.
        </p>
      )}
      {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="bg-white rounded-xl border border-cyan-pale shadow-soft overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-ink-secondary">Loading packages…</p>
        ) : packages.length === 0 ? (
          <p className="p-6 text-sm text-ink-secondary">No packages yet. {canManage ? 'Click "New Package" to add the first one.' : ''}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-cloud-100 text-ink-secondary text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Destination</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price / pax</th>
                <th className="px-4 py-3 font-medium">Slots</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {canManage && <th className="px-4 py-3 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-pale">
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td className="px-4 py-3 font-medium text-navy-main">{pkg.title}</td>
                  <td className="px-4 py-3 text-ink-secondary">{pkg.destination}</td>
                  <td className="px-4 py-3 text-ink-secondary capitalize">{pkg.category}</td>
                  <td className="px-4 py-3 text-ink-secondary">₱{Number(pkg.price_per_pax).toLocaleString()}</td>
                  <td className="px-4 py-3 text-ink-secondary">
                    {pkg.slots_remaining ?? '—'}{pkg.total_slots ? ` / ${pkg.total_slots}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    {pkg.status === 'draft' ? (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-cloud-200 text-ink-secondary">Draft</span>
                    ) : (
                      <button
                        disabled={!canManage}
                        onClick={() => toggleActive(pkg)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          pkg.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-cloud-200 text-ink-secondary'
                        } ${canManage ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        {pkg.is_active ? 'Active' : 'Paused'}
                      </button>
                    )}
                  </td>
                  {canManage && (
                    <td className="px-4 py-3 text-right space-x-3">
                      <button onClick={() => openEditModal(pkg)} className="text-sky-primary font-medium hover:underline">Edit</button>
                      <button onClick={() => handleDelete(pkg)} className="text-rose-600 font-medium hover:underline">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-navy-main/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-softLg">
            <h2 className="text-lg font-bold text-navy-main">{editingId ? 'Edit Package' : 'New Package'}</h2>

            <div className="space-y-3">
              <input name="title" required placeholder="Package Name" value={form.title} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary" />
              <input name="destination" required placeholder="Destination" value={form.destination} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary" />

              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm capitalize focus:outline-none focus:ring-2 focus:ring-sky-primary">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <input name="price_per_pax" type="number" min="0" step="0.01" required placeholder="Price per pax"
                  value={form.price_per_pax} onChange={handleChange} className="px-3 py-2 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary" />
                <input name="duration_days" type="number" min="1" required placeholder="Duration (days)"
                  value={form.duration_days} onChange={handleChange} className="px-3 py-2 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary" />
              </div>

              <input name="best_travel_months" placeholder="Best Travel Months (e.g. December - February)"
                value={form.best_travel_months} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary" />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-ink-secondary">Description (rough draft is fine)</label>
                  <button
                    type="button"
                    onClick={handleAiPolish}
                    disabled={aiPolishing}
                    className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {aiPolishing ? 'Polishing…' : 'AI Polish'}
                  </button>
                </div>
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}
                  rows={3} className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary" />
                {aiNotice && (
                  <p className="text-xs text-violet-600 bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 mt-2">
                    ✨ AI writing assistant isn't connected yet — a teammate is wiring up the real Gemini integration. Once it's live, this button will auto-polish your draft into a website-ready description and suggest an itinerary below.
                  </p>
                )}
              </div>

              <textarea name="itinerary" placeholder="Basic Itinerary (one line per day, e.g. 'Day 1: Arrival & hotel check-in')"
                value={form.itinerary} onChange={handleChange} rows={3} className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary" />

              <div className="grid grid-cols-2 gap-3">
                <input name="total_slots" type="number" min="0" placeholder="Total Slots"
                  value={form.total_slots} onChange={handleChange} className="px-3 py-2 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary" />
                <input name="slots_remaining" type="number" min="0" placeholder="Slots Remaining"
                  value={form.slots_remaining} onChange={handleChange} className="px-3 py-2 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary" />
              </div>

              <textarea name="inclusions" placeholder="Inclusions (one per line)" value={form.inclusions} onChange={handleChange}
                rows={3} className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary" />
              <textarea name="exclusions" placeholder="Exclusions (one per line)" value={form.exclusions} onChange={handleChange}
                rows={3} className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary" />

              {editingId && (
                <label className="flex items-center gap-2 text-sm text-ink-secondary">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
                  Active (visible to customers, only applies once published)
                </label>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-sky-primary text-sky-primary hover:bg-cloud-100">
                  Cancel
                </button>
                <button type="button" disabled={saving} onClick={() => submitWithStatus('draft')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-sky-primary text-sky-primary hover:bg-cloud-100 disabled:opacity-60">
                  Save Draft
                </button>
                <button type="button" disabled={saving} onClick={() => submitWithStatus('published')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand-red hover:bg-brand-redDeep text-white disabled:opacity-60">
                  {saving ? 'Saving…' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}