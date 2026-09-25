import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../services/apiClient';


const STAFF_ROLES = ['junior_csr', 'senior_csr', 'tour_coordinator', 'tour_guide', 'admin'];

const ROLE_LABELS = {
  junior_csr: 'Junior CSR',
  senior_csr: 'Senior CSR',
  tour_coordinator: 'Tour Coordinator',
  tour_guide: 'Tour Guide',
  admin: 'Admin',
};

const EMPTY_FORM = { email: '', password: '', full_name: '', contact_number: '', role: 'junior_csr' };


export default function ManageStaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { staff } = await apiRequest('/staff');
      setStaff(staff);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await apiRequest('/staff', { method: 'POST', body: JSON.stringify(form) });
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchStaff();
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const handleRoleChange = async (id, role) => {
    try {
      await apiRequest(`/staff/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
      fetchStaff();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-main">Manage Staff</h1>
          <p className="text-ink-secondary text-sm">Create and manage staff and tour guide accounts.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-red hover:bg-brand-redDeep text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-soft"
        >
          + New Staff Account
        </button>
      </div>

      {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="bg-white rounded-xl border border-cyan-pale shadow-soft overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-ink-secondary">Loading…</p>
        ) : staff.length === 0 ? (
          <p className="p-6 text-sm text-ink-secondary">No staff accounts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-cloud-100 text-ink-secondary text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-pale">
              {staff.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-medium text-navy-main">{s.full_name}</td>
                  <td className="px-4 py-3 text-ink-secondary">{s.contact_number || '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={s.role}
                      onChange={(e) => handleRoleChange(s.id, e.target.value)}
                      className="text-xs font-semibold px-2 py-1.5 rounded-lg border border-cyan-pale"
                    >
                      {STAFF_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-navy-main/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 shadow-softLg">
            <h2 className="text-lg font-bold text-navy-main">New Staff Account</h2>

            <form onSubmit={handleCreate} className="space-y-3">
              <input name="full_name" required placeholder="Full Name" value={form.full_name} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm" />
              <input name="contact_number" placeholder="Contact Number" value={form.contact_number} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm" />
              <input type="email" name="email" required placeholder="Email" value={form.email} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm" />
              <input type="password" name="password" required placeholder="Temporary Password" value={form.password} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm" />

              <select name="role" value={form.role} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm">
                {STAFF_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-sky-primary text-sky-primary hover:bg-cloud-100">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand-red hover:bg-brand-redDeep text-white disabled:opacity-60">
                  {saving ? 'Creating…' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}